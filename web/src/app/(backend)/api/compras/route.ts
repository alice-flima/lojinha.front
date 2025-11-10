import CompraService from '../../services/compras';
import { NextRequest, NextResponse } from 'next/server';
import { compraSchema } from '@/app/(backend)/schemas/compra.schema';
import { compraStatusSchema } from '../../schemas/compra.patch.schema';
import prisma from '@/app/(backend)/services/db';
import { handleError } from '../errors/Erro';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }
    const compra = await CompraService.getAll(id); 

    return NextResponse.json(compra);
  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });

  }
}

export async function POST(request: NextRequest) {
  try {
    
    const session = { user: { id: "usuario_teste" } };
    const user = session.user;
    

    const body = await request.json();
    const validationResult = compraSchema.safeParse(body);
    if (!validationResult.success) {
      const erro = await handleError(new ZodError(validationResult.error.issues));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const { produtos } = validationResult.data;
    const itensCompraProduto = produtos.map((id: string) => ({ produtoId: id }));

    const compra = await CompraService.create(user.id, itensCompraProduto);
    return NextResponse.json(compra);
  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });

  }
}
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    if (!id) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const body = await request.json();
    const validationResult = compraSchema.safeParse(body);

    if (!validationResult.success) {
      const erro = await handleError(new ZodError(validationResult.error.issues));
      return NextResponse.json(erro, { status: erro.statusCode });
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
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });

  }
}
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    if (!id) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }
    const compraDeletada = await CompraService.delete(id);
    return NextResponse.json(compraDeletada);
  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });

  }
}
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    if (!id) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }
    const body = await request.json();
    
    const validationResult = compraStatusSchema.safeParse(body);

   if (!validationResult.success) {
     const erro = await handleError(new ZodError(validationResult.error.issues));
      return NextResponse.json(erro, { status: erro.statusCode });
    }
    const compraAtualizada = await CompraService.update(id, {
      status: validationResult.data.status,
    });
    return NextResponse.json(compraAtualizada);
  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });

  }
}