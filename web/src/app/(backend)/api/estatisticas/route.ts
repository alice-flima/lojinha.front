import EstatisticasService from '../../services/Estatisticas';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest){
   try{
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id') || '';
    const dados = await EstatisticasService.dados(userId);
    const compras = dados.comprasUser;
    const valor = dados.precoTotal;
    const produto_mais_comprado = dados.produtoMaisComprado;
    const estatisticas = {
      Numero_de_compras : compras, 
      Valor_total_das_compras: valor,
      Produto_Mais_Comprado: produto_mais_comprado,
    };
    return NextResponse.json(estatisticas);
    }
    catch (error) {
    return NextResponse.json({ error: 'Erro ao pesquisar estatísticas' }, { status: 500 }); 
  }
}