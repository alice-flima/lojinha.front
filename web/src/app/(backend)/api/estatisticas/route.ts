import EstatisticasService from '../../services/Estatisticas'; 
import { NextRequest, NextResponse } from 'next/server';
import { handleError } from '../errors/Erro';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { message: "O parâmetro 'id' é obrigatório na URL" },
        { status: 400 } 
      );
    }

    const dados = await EstatisticasService.dados(userId);

    const estatisticas = {
      Numero_de_compras: dados.comprasUser,
      Valor_total_das_compras: dados.precoTotal,
      Produto_Mais_Comprado: dados.produtoMaisComprado,
    };

    return NextResponse.json(estatisticas);

  } catch (error) {
    
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode || 500 });
  }
}