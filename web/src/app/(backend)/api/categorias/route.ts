import { NextRequest, NextResponse } from "next/server";
import CategoriaService from '../../services/categoria';
import { categoriaSchema } from "@/app/(backend)/schemas/categoria.schema";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const categoria = await CategoriaService.getById(id);
      if (!categoria)
        return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
      return NextResponse.json(categoria);
    }

    const categorias = await CategoriaService.getAll();
    return NextResponse.json(categorias);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = categoriaSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Erro de validação' }, { status: 400 });
    }

    const categoria = await CategoriaService.create(validationResult.data);
    return NextResponse.json(categoria, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: 'Erro de validação' }, { status: 400 });

    const body = await request.json();
    const validationResult = categoriaSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Erro de validação' }, { status: 400 });
    }
    const data = validationResult.data;
    const categoriaAtualizada = await CategoriaService.update(id, data);
    return NextResponse.json(categoriaAtualizada);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json({ error: 'Erro de validação' }, { status: 400 });

    const categoria = await CategoriaService.delete(id);
    return NextResponse.json(categoria);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao deletar categoria" }, { status: 500 });
  }
}
