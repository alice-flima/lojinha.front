import prisma from "../db";
import { Categoria } from "@/generated/prisma";

export class CategoriaService {
public async create(data: any): Promise<any> {
  const produtos = data.produtos ?? [];
  delete data.produtos;

  const categoria = await prisma.categoria.create({
    data: {
      ...data,
      produtos: produtos.length
        ? {
            create: produtos.map((produtoId: string) => ({
              produto: { connect: { id: produtoId } }
            }))
          }
        : undefined
    },
    include: {
      produtos: true 
    }
  });

  return {
    ...categoria,
    produtos: categoria.produtos.map((p) => p.produtoId)
  };
}
public async getAll(): Promise<any[]> {
  const categorias = await prisma.categoria.findMany({
    include: {
      produtos: {
        select: { produtoId: true }
      }
    },
  });

  return categorias.map(categoria => ({
    ...categoria,
    produtos: categoria.produtos.map(p => p.produtoId)
  }));
}
public async getById(id: string): Promise<any | null> {
  const categoria = await prisma.categoria.findUnique({
    where: { id },
    include: {
      produtos: {
        select: { produtoId: true }
      }
    }
  });

  if (!categoria) return null;

  return {
    ...categoria,
    produtos: categoria.produtos.map(p => p.produtoId)
  };
}

public async update(id: string, data: any): Promise<any> {
  const { produtos, ...rest } = data;

  const categoria = await prisma.categoria.update({
    where: { id },
    data: {
      ...rest, 
      ...(produtos !== undefined && {
        produtos: {
          deleteMany: {},
          ...(produtos.length > 0 && {
            create: produtos.map((produtoId: string) => ({ produtoId }))
          })
        }
      })
    },
    include: {
      produtos: {
        select: { produtoId: true }
      }
    }
  });

  return {
    ...categoria,
    produtos: categoria.produtos.map(p => p.produtoId)
  };
}


  public async delete(id: string): Promise<Categoria> {
  await prisma.produtoCategoria.deleteMany({
    where: { categoriaId: id }
  });

  return prisma.categoria.delete({
    where: { id }
  });
}

}

export default new CategoriaService();
