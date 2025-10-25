 import type ProdutoCard from './interfacedosprodutos';
 
 interface Props {
   produto: ProdutoCard;
 }

  function ProdutoCards({ produto }: Props) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '5px' }}>
      <h2>{produto.nome}</h2>
      <p>{produto.descricao}</p>
      <p>R$ {produto.preco}</p>
      <button>Adicionar</button>
    </div>
  );
}

export default ProdutoCards;

///era da versao antiga, nao esta sendo utilizado