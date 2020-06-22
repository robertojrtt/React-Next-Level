import React from "react";
import "./style.css";
import Logo from "../../assets/logo.svg";
import { FiLogIn, FiList } from "react-icons/fi";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={Logo} alt="Logo E-coleta" />
        </header>
        <main>
          <h1>Seu marketplace de colete de resíduos.</h1>
          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
          </p>
          <Link to="/create-point">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </Link>

          <Link to="/list-point">
            <span>
              <FiList />
            </span>
            <strong>Listagem ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
