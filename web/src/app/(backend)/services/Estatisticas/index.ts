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
}
  }
}
///devolve o numero de compras do user e o valor total gasto por ele na loja juntando todas as compras

export default new EstatisticasService();