import { NextRequest, NextResponse } from "next/server";
import CategoriaService from '../../services/categoria';
import { categoriaSchema } from "@/app/(backend)/schemas/categoria.schema";
import { ZodError } from "zod";
import { handleError } from "../errors/Erro";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const categoria = await CategoriaService.getById(id);

    if (!categoria) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    return NextResponse.json(categoria);
  
  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}



export async function POST(request: NextRequest) {
  try{
    const body = await request.json();
    const validationResult = categoriaSchema.safeParse(body);

    if (!validationResult.success) {
      const erro = await handleError(new ZodError(validationResult.error.issues));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const categoria = await CategoriaService.create(validationResult.data);
    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}


export async function PUT(request: NextRequest) {
  try{
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const body = await request.json();
    const validationResult = categoriaSchema.safeParse(body);

    if (!validationResult.success) {
      const erro = await handleError(new ZodError(validationResult.error.issues));
      return NextResponse.json(erro, { status: erro.statusCode });
    }
    const data = validationResult.data;
    const categoriaAtualizada = await CategoriaService.update(id, data);
    return NextResponse.json(categoriaAtualizada);
} catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}

export async function DELETE(request: NextRequest) {
  try{
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

   if (!id) {
      const erro = await handleError(new ZodError([]));
      return NextResponse.json(erro, { status: erro.statusCode });
    }

    const categoria = await CategoriaService.delete(id);
    return NextResponse.json(categoria);
} catch (error) {
    const erro = await handleError(error);
    return NextResponse.json(erro, { status: erro.statusCode });
  }
}

