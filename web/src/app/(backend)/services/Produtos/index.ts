import prisma from "../db";
import { Produto } from "@/generated/prisma";

export class ProdutoService {
  public async create(data: any): Promise<any> {
    const categorias = data.categorias ?? [];
    delete data.categorias;

    const produto = await prisma.produto.create({
      data: {
        ...data,
        categorias: categorias.length
          ? {
              create: categorias.map((categoriaId: string) => ({
                categoriaId
              }))
            }
          : undefined
      },
      include: {
        categorias: {
          select: { categoriaId: true }
        }
      }
    });

    return {
      ...produto,
      categorias: produto.categorias.map((c) => c.categoriaId)
    };
  }

  public async getById(id: string): Promise<any | null> {
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        categorias: {
          select: { categoriaId: true }
        }
      }
    });

    if (!produto) return null;

    return {
      ...produto,
      categorias: produto.categorias.map((c) => c.categoriaId)
    };
  }

  public async update(id: string, data: any): Promise<any> {
    const categorias = data.categorias;
    delete data.categorias;

    const produto = await prisma.produto.update({
      where: { id },
      data: {
        ...data,
        ...(categorias !== undefined && {
          categorias: {
            deleteMany: {},
            ...(categorias.length > 0 && {
              create: categorias.map((categoriaId: string) => ({ categoriaId }))
            })
          }
        })
      },
      include: {
        categorias: {
          select: { categoriaId: true }
        }
      }
    });

    return {
      ...produto,
      categorias: produto.categorias.map((c) => c.categoriaId)
    };
  }

  public async delete(id: string): Promise<Produto> {

  await prisma.produtoCategoria.deleteMany({ ///deleta os relacionamentos com categoria antes de deletar o produto
    where: { produtoId: id }
  });

  return prisma.produto.delete({
    where: { id }
  });
}


  public async getAll(): Promise<any[]> {
    const produtos = await prisma.produto.findMany({
      include: {
        categorias: {
          select: { categoriaId: true }
        }
      }
    });

    return produtos.map((produto) => ({
      ...produto,
      categorias: produto.categorias.map((c) => c.categoriaId)
    }));
  }
}

export default new ProdutoService();
