import CompraService from '../../services/compras';
import { NextRequest, NextResponse } from 'next/server';
import { compraSchema } from '@/app/(backend)/schemas/compra.schema';
import { compraStatusSchema } from '../../schemas/compra.patch.schema';
import prisma from '@/app/(backend)/services/db';
import { handleError } from '../errors/Erro';
import { ZodError } from 'zod';
import { auth } from '@/auth';
import { sendEmail } from '../../Emails/email.status'; 
import { BetterAuthError } from 'better-auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user;

    if (!user) {
      throw new BetterAuthError("Usuário não autenticado");
    }

    const compras = await prisma.compra.findMany({
      where: {
        userId: user.id
      },
      include: {
        produtos: true
      }
    });

    return NextResponse.json(compras);
  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user;
    
    if (!user) {
      throw new BetterAuthError("Usuário não autenticado");
    }

    const body = await request.json();
    const validationResult = compraSchema.safeParse(body);
    
    if (!validationResult.success) {
      const erro = await handleError(new ZodError(validationResult.error.issues));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const { produtos } = validationResult.data;
    const itensCompraProduto = produtos.map((id: string) => ({ produtoId: id }));

    const compra = await CompraService.create(user.id, itensCompraProduto);
    return NextResponse.json(compra, { status: 201 });
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
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const user = session?.user;

    if (!user) {
      throw new BetterAuthError("Usuário não autenticado");
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";

    if (!id) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const body = await request.json();
    const validationResult = compraStatusSchema.safeParse(body);

    if (!validationResult.success) {
      const erro = await handleError(
        new ZodError(validationResult.error.issues)
      );
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const compraAtualizada = await CompraService.update(id, {
      status: validationResult.data.status,
    });
    
    const compra = await prisma.compra.findUnique({
      where: { id },
    });

    if (!compra) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const usuario = await prisma.user.findUnique({
      where: { id: compra?.userId },
    });

    if (!usuario) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const email: string = usuario.email;
    const status = compraAtualizada.status;

    let subject = "";
    let corpo = "";

    if (status === "PAID") {
      subject = "Pagamento confirmado";
      corpo = "Seu pedido foi atualizado para PAID";
      await sendEmail(email, subject, corpo);
    }

    if (status === "SHIPPED") {
      subject = "Pedido enviado";
      corpo = "Seu pedido foi atualizado para SHIPPED";
      await sendEmail(email, subject, corpo);
    }

    if (status === "DELIVERED") {
      subject = "Pedido entregue";
      corpo = "Seu pedido foi atualizado para DELIVERED";
      await sendEmail(email, subject, corpo);
    }
  
    return NextResponse.json(compraAtualizada);
  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}