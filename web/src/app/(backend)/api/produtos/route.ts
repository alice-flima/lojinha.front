import ProdutoService from '../../services/Produtos';
import { NextRequest, NextResponse } from 'next/server';
import { produtoSchema } from '@/app/(backend)/schemas/produtos.schema';


export async function GET(){
  try{
  const produtos = await ProdutoService.getAll();
  return NextResponse.json(produtos);
  }
  catch (error) {
  return NextResponse.json({ error: 'Erro ao pesquisar produtos' }, { status: 500 }); 
}
}
export async function POST(request: NextRequest){
  try {
    const data = await request.json();
    data.preco = Number(data.preco);
    const validationResult = produtoSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Erro de validação' }, { status: 400 });
    }

    return NextResponse.json(await ProdutoService.create(validationResult.data));
  }
catch (error) {
  return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 }); 
}
}
export async function PUT(request: NextRequest){
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const data = await request.json();
    data.preco = Number(data.preco);
    const validationResult = produtoSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Erro de validação' }, { status: 400 });
    }
    return NextResponse.json(await ProdutoService.update(id, validationResult.data));
  }
  catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 }); 
  }
}
  export async function DELETE(request: NextRequest){
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id') || '';
      return NextResponse.json(await ProdutoService.delete(id));
    }
    catch (error) {
      return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 }); 
    }
}


