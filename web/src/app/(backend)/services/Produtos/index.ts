import prisma from "../db";
import { Produto, Prisma } from '@/generated/prisma';

export
class ProdutoService{
  public async create(data: Prisma.ProdutoCreateInput): Promise<Produto>{
    return  prisma.produto.create({
      data,
      include: {
        categorias: true,
      }
    });
  }
  public async getById(id: string): Promise<Produto | null>{
    return  prisma.produto.findUnique({
      where: { id },
      include: {
        categorias: true,
      }
    });
  }
    public async update(id: string, data: Prisma.ProdutoUpdateInput): Promise<Produto>{
      return  prisma.produto.update({
        where: { id },
        data,
      });
    }
    public async delete(id: string): Promise<Produto>{
      return  prisma.produto.delete({
        where: { id },
      });
    };
    public async getAll(): Promise<Produto[]>{
      return prisma.produto.findMany({
        include: {
          categorias: true,
        }
      });
    }
  }
export default new ProdutoService();