import prisma from "../db";
import { Categoria } from "@/generated/prisma";

interface ICategoriaInput {
  nome: string;
  produtos?: string[];
}

export interface CategoriaDTO extends Omit<Categoria, 'produtos'> {
  produtos: string[];
}

type CategoriaDoBanco = Categoria & {
  produtos: { id: string }[];
};

export class CategoriaService {
  
  public async create(data: ICategoriaInput): Promise<CategoriaDTO> {
    const { nome, produtos } = data;
    const produtosIds: string[] = Array.isArray(produtos) ? produtos : [];

    const categoria = await prisma.categoria.create({
      data: {
        nome: nome,
        produtos: produtosIds.length > 0
          ? {
              connect: produtosIds.map((id) => ({ id }))
            }
          : undefined
      },
      include: {
        produtos: {
          select: { id: true }
        }
      }
    });

    return this.mapToDto(categoria as CategoriaDoBanco);
  }

  public async getAll(): Promise<CategoriaDTO[]> {
    const categorias = await prisma.categoria.findMany({
      include: {
        produtos: {
          select: { id: true }
        }
      },
    });

    return categorias.map((categoria) => this.mapToDto(categoria as CategoriaDoBanco));
  }

  public async getById(id: string): Promise<CategoriaDTO | null> {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        produtos: {
          select: { id: true }
        }
      }
    });

    if (!categoria) return null;

    return this.mapToDto(categoria as CategoriaDoBanco);
  }

  public async update(id: string, data: Partial<ICategoriaInput>): Promise<CategoriaDTO> {
    const { nome, produtos } = data;
    const produtosIds = Array.isArray(produtos) ? produtos : undefined;

    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(produtosIds !== undefined && {
          produtos: {
            set: produtosIds.map((id) => ({ id }))
          }
        })
      },
      include: {
        produtos: {
          select: { id: true }
        }
      }
    });

    return this.mapToDto(categoria as CategoriaDoBanco);
  }

  public async delete(id: string): Promise<CategoriaDTO> {
    const categoria = await prisma.categoria.delete({
      where: { id },
      include: {
        produtos: {
          select: { id: true }
        }
      }
    });

    return this.mapToDto(categoria as CategoriaDoBanco);
  }

  private mapToDto(categoria: CategoriaDoBanco): CategoriaDTO {
    return {
      ...categoria,
      produtos: categoria.produtos.map((p) => p.id)
    };
  }
}

const categoriaService = new CategoriaService();
export default categoriaService;