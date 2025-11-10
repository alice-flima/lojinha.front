import ProdutoService from '../../services/Produtos';
import { NextRequest, NextResponse } from 'next/server';
import { produtoSchema } from '@/app/(backend)/schemas/produtos.schema';
import { handleError } from '../errors/Erro';
import { ZodError } from 'zod';


export async function GET(){
  try{
  const produtos = await ProdutoService.getAll();
  return NextResponse.json(produtos);
  }
  catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}
export async function POST(request: NextRequest){
  try {
    const data = await request.json();
    data.preco = Number(data.preco);
    const validationResult = produtoSchema.safeParse(data);
    if (!validationResult.success) {
      const erro = await handleError(new ZodError(validationResult.error.issues));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    return NextResponse.json(await ProdutoService.create(validationResult.data));
  }
catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}
export async function PUT(request: NextRequest){
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    if (!id) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }
    const data = await request.json();
    data.preco = Number(data.preco);
  
    const validationResult = produtoSchema.safeParse(data);
    if (!validationResult.success) {
      const erro = await handleError(new ZodError(validationResult.error.issues));
      return NextResponse.json(erro, { status: erro.statusCode });
    }
    return NextResponse.json(await ProdutoService.update(id, validationResult.data));
  }
  catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}
  export async function DELETE(request: NextRequest){
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id') || '';
      if (!id) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }
      return NextResponse.json(await ProdutoService.delete(id));
    }
    catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}


