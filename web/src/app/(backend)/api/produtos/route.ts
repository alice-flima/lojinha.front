import { NextRequest, NextResponse } from 'next/server';
import ProdutoService from '../../services/Produtos'; 
import { produtoSchema } from '@/app/(backend)/schemas/produtos.schema';
import { handleError } from '../errors/Erro';
import { ZodError } from 'zod';

export async function GET() {
  try {
    const produtos = await ProdutoService.getAll();
    return NextResponse.json(produtos);
  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = produtoSchema.safeParse(body);

    if (!validationResult.success) {
      const erro = await handleError(new ZodError(validationResult.error.issues));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const dadosParaSalvar = {
      ...validationResult.data,
      preco: Number(validationResult.data.preco) 
    };

    const novoProduto = await ProdutoService.create(dadosParaSalvar);
    return NextResponse.json(novoProduto, { status: 201 });

  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: "ID obrigatório" }, { status: 400 });
    }

    const body = await request.json();
    const validationResult = produtoSchema.safeParse(body);

    if (!validationResult.success) {
      const erro = await handleError(new ZodError(validationResult.error.issues));
      return NextResponse.json(erro, { status: erro.statusCode });
    }
    const dadosParaAtualizar = {
      ...validationResult.data,
      preco: Number(validationResult.data.preco)
    };

    const produtoAtualizado = await ProdutoService.update(id, dadosParaAtualizar);
    return NextResponse.json(produtoAtualizado);

  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: "ID obrigatório" }, { status: 400 });
    }

    const produtoDeletado = await ProdutoService.delete(id);
    return NextResponse.json(produtoDeletado);

  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}