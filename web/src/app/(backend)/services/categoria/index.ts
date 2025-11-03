import prisma from "../db";
import { Categoria, Prisma } from "@/generated/prisma";

class CategoriaService {
  public async create(data: Prisma.CategoriaCreateInput): Promise<Categoria> {
    return prisma.categoria.create({
      data,
      include: { produtos: { include: { produto: true } } },
    });
  }

  public async getAll(): Promise<Categoria[]> {
    return prisma.categoria.findMany({
      include: { produtos: { include: { produto: true } } },
    });
  }

  public async getById(id: string): Promise<Categoria | null> {
    return prisma.categoria.findUnique({
      where: { id },
      include: { produtos: { include: { produto: true } } },
    });
  }

  public async update(id: string, data: Prisma.CategoriaUpdateInput): Promise<Categoria> {
    return prisma.categoria.update({
      where: { id },
      data,
      include: { produtos: { include: { produto: true } } },
    });
  }

  public async delete(id: string): Promise<Categoria> {
    return prisma.categoria.delete({ where: { id } });
  }
}

export default new CategoriaService();
