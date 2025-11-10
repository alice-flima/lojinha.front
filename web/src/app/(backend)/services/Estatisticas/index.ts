import prisma from "../db"; 
 
export class EstatisticasService{
  public async dados(userId:string){
    const compras = await prisma.compra.findMany({
    where: { userId },
    include: {
      produtos: {
        include: {
          produto: true,
        },
      },
    },
  });
  if(compras.length >0){  ///verificca se o usuario já fez alguma
  
  const todos_produtos = compras.flatMap(compra =>
        compra.produtos.map(cp => cp.produto.nome)
      ); //// faz um array com todos os produtos de todas as compras
  const contagem = todos_produtos.reduce((acc, valor) => {
  acc[valor] = (acc[valor] || 0) + 1;
  return acc;
}, {} as Record<string, number>); ///conta quantas vzs cada produto aparece no array
const produtoMaisComprado= Object.keys(contagem).reduce((acc, valor) => {
  return contagem[valor] > contagem[acc] ? valor : acc;
}, Object.keys(contagem)[0]); ///pega o produto que mais aparece

  let precoTotal =0;
  let comprasUser = 0;
  if (compras.length != 0){
  precoTotal = compras.reduce((total, compra) => {
    return total + compra.precoTotal;
  },0);
  comprasUser = compras.length;
}
return {
  precoTotal,
  comprasUser,
  produtoMaisComprado,
}
  } else{
    return {
      precoTotal: 0,
      comprasUser: 0,
      produtoMaisComprado: null,
    }
  }
}
}
///devolve o numero de compras do user e o valor total gasto por ele na loja juntando todas as compras

export default new EstatisticasService();