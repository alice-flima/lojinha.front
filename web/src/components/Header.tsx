import React from "react";
import Nav from "./Nav";
import useCarro from "../hooks/useCarro";

type NavProps = {
  verCarrinho: boolean;
  setVerCarrinho: React.Dispatch<React.SetStateAction<boolean>>;
}

type PropsType = {
  verCarrinho : boolean,
  setVerCarrinho: React.Dispatch<React.SetStateAction<boolean>>
}
const Header = ({verCarrinho, setVerCarrinho}: PropsType) => {
  return (
    <header className="header">
      <Nav verCarrinho={verCarrinho} setVerCarrinho={setVerCarrinho} />
      <div>
        <p>Itens: </p>
        <p></p>
      </div>
    </header>
  )
}

export default Header