import React from "react";

type PropsType = {
  verCarrinho: boolean;
  setVerCarrinho: React.Dispatch<React.SetStateAction<boolean>>;
};

const Nav = ({ verCarrinho, setVerCarrinho }: PropsType) => {
  const button = verCarrinho ? (
    <button onClick={() => setVerCarrinho(false)}>Itens</button>
  ) : (
    <button onClick={() => setVerCarrinho(true)}>Ver Carrinho</button>
  );

  return (
    <nav className="nav">
      {button}
    </nav>
  );
};

export default Nav;
