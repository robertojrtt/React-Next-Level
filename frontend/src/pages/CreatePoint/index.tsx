import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "./style.css";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import Api from "../../services/api";
import { LeafletMouseEvent } from "leaflet";
import axios from "axios";
import Success from '../../component/Success';
interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [initialPosition, setinitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [success, setSuccess] = useState<boolean>(false);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>("0");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setinitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    setSelectedPosition(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    Api.get("items").then((response) => {
      setItems(response.data);
    });

    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufinitials = response.data.map((uf) => uf.sigla);
        setUfs(ufinitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") return;
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cities = response.data.map((city) => city.nome);
        setCities(cities);
      });
  }, [selectedUf]);

  function handleSelectuf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }
  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item == id);
    if (alreadySelected >= 0) {
      const filterItems = selectedItems.filter((item) => item !== id);
      setSelectedItems(filterItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;
    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items,
    };

    await Api.post("points", data);
    
    setSuccess(true);
    return;
  }

  return (
    <div id="page-create-point">
      {success && <Success />}
      <header>
        <img src={Logo} alt="Logo" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>
          Cadrastro do <br /> ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
        </fieldset>
        <div className="field">
          <label htmlFor="name">Nome da Entidade</label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={handleInputChange}
          />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleInputChange}
          />
        </div>
        <div className="field">
          <label htmlFor="whatsapp">whatsapp</label>
          <input
            type="text"
            name="whatsapp"
            id="whatsapp"
            onChange={handleInputChange}
          />
        </div>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço abaixo</span>
          </legend>
        </fieldset>

        <Map center={initialPosition} zoom={14} onClick={handleMapClick}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={selectedPosition} />
        </Map>

        <div className="field">
          <label htmlFor="uf">Estado (UF)</label>
          <select
            onChange={handleSelectuf}
            value={selectedUf}
            name="uf"
            id="uf"
          >
            <option value="0">Selecione uma UF</option>
            {ufs.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="city">Cidade</label>
          <select
            onChange={handleSelectCity}
            value={selectedCity}
            name="city"
            id="city"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend>
            <h2>Ítems de Coleta</h2>
            <span>Selecione os itens abaixo</span>
          </legend>
        </fieldset>

        <ul className="items-grid">
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelectItem(item.id)}
              className={selectedItems.includes(item.id) ? "selected" : ""}
            >
              <img src={item.image_url} alt={item.title} />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;