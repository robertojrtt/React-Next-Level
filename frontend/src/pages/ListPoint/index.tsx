import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Logo from "../../assets/logo.svg";
import "./style.css";
import Api from "../../services/api";

interface Point {
  id: number;
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
}

const List = () => {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    Api.get("points").then((reponse) => {
      setPoints(reponse.data)
    });
  }, []);

  return (
    <div id="page-list-point">
      <header>
        <img src={Logo} alt="Logo" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <main>
        <h1>
          Listagem dos <br /> pontos de coleta
        </h1>
        <ul>
        {
          points.map((point)=>(
            <li key={point.id}>
              <div>
                <p><strong>ID:</strong> {point.id}</p>
                <p><strong>Nome:</strong> {point.name}</p>
                <p><strong>Whatsapp:</strong> {point.whatsapp}</p> 
                <p><strong>Email:</strong> {point.email}</p>
                <p><strong>Cidade:</strong> {point.city}</p> 
                <p><strong>Estado:</strong> {point.uf}</p> 
              </div>
             <img src={point.image} alt=""/>
            </li>
          ))
        }
        </ul>
      </main>
    </div>
  );
};

export default List;
