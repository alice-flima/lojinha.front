import ProdutoCategoriaService from '../../../../services/ProdutoCategoria';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest){
   try{
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id') || '';
      const categoria = await ProdutoCategoriaService.getById(id);
      return NextResponse.json(categoria);
      }
      catch (error) {
      return NextResponse.json({ error: 'Erro ao pesquisar categoria' }, { status: 500 }); 
    }
}
export async function POST(request: NextRequest){
  try {
    const data = await request.json();
    return NextResponse.json(await ProdutoCategoriaService.create(data));
  }
catch (error) {
  return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 }); 
}
}
export async function PUT(request: NextRequest){
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const data = await request.json();
    return NextResponse.json(await ProdutoCategoriaService.update(id, data));
  }
  catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 }); 
  }
}
  export async function DELETE(request: NextRequest){
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id') || '';
      return NextResponse.json(await ProdutoCategoriaService.delete(id));
    }
    catch (error) {
      return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 }); 
    }
}


