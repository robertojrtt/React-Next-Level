import React from "react";
import { useHistory } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

import "./style.css";

const Success = () => {
  const history = useHistory();

  function handleHome() {
    history.push("/");
  }
  return (
    <div id="success" onClick={handleHome}>
      <FiCheckCircle />  
      <h2>Cadastro concluído!</h2>
    </div>
  );
};


export default Success;
