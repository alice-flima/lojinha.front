import CompraService from '../../services/compras';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { compraSchema } from '@/app/(backend)/schemas/compra.schema';
import prisma from '@/app/(backend)/services/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Parâmetro "id" é obrigatório' }, { status: 400 });
    }
    const compra = await CompraService.getAll(id); 

    return NextResponse.json(compra);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao pesquisar compra' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
    headers: request.headers,
    });
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = compraSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Erro de validação' }, { status: 400 });
    }

    const { produtos } = validationResult.data;
    const itensCompraProduto = produtos.map((id: string) => ({ produtoId: id }));

    const compra = await CompraService.create(user.id, itensCompraProduto);
    return NextResponse.json(compra);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar compra' }, { status: 500 });
  }
}
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';

    const body = await request.json();
    const validationResult = compraSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Erro de validação', details: validationResult.error },
        { status: 400 }
      );
    }

    const { produtos } = validationResult.data;
    const itensCompraProduto = produtos.map((id: string) => ({ produtoId: id }));
    const produtosInfo = await prisma.produto.findMany({
      where: { id: { in: produtos } },
      select: { preco: true },
    });

    const precoTotal = produtosInfo.reduce(
      (acc: number, p: { preco: number }) => acc + p.preco,
      0
    );
    const compraAtualizada = await prisma.$transaction(async (tx) => {
      await tx.compraProduto.deleteMany({ where: { compraId: id } });

      await Promise.all(
        itensCompraProduto.map((p) =>
          tx.compraProduto.create({
            data: { compraId: id, produtoId: p.produtoId },
          })
        )
      );
      return tx.compra.update({
        where: { id },
        data: { precoTotal },
        include: { produtos: true },
      });
    });

    return NextResponse.json(compraAtualizada);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar compra' }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const compraDeletada = await CompraService.delete(id);
    return NextResponse.json(compraDeletada);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar compra' }, { status: 500 });
  }
}
