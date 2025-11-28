import prisma from "../db";
import { Produto } from "@/generated/prisma";
////interface para nao usar any no tipo
interface IProdutoInput {
  nome: string;
  descricao: string;
  preco: number;
  imagem?: string | null;
  categorias?: string[];
}
////omite a categoria para poder repassar uma lista de strings no lugar- ids em vez de objetos
export interface ProdutoDTO extends Omit<Produto, 'categorias'> {
  categorias: string[];
}

type ProdutoDoBanco = Produto & {
  categorias: { id: string }[];
};

export class ProdutoService {
  
  public async create(data: IProdutoInput): Promise<ProdutoDTO> {
    const { categorias, ...dadosPrisma } = data; ///separa categorias do resto
    const categoriasIds = categorias ?? [];

    const produto = await prisma.produto.create({
      data: {
        ...dadosPrisma,
        categorias: categoriasIds.length > 0
          ? {
              connect: categoriasIds.map((id) => ({ id })) ///conecta as categorias
            }
          : undefined
      },
      include: {
        categorias: {
          select: { id: true }
        }
      }
    });

    return this.mapToDto(produto as ProdutoDoBanco);
  }

  public async getById(id: string): Promise<ProdutoDTO | null> {
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        categorias: {
          select: { id: true }
        }
      }
    });

    if (!produto) return null;
    return this.mapToDto(produto as ProdutoDoBanco);
  }

  public async update(id: string, data: Partial<IProdutoInput>): Promise<ProdutoDTO> {
    const { categorias, ...dadosPrisma } = data;
    const categoriasIds = categorias;

    const produto = await prisma.produto.update({
      where: { id },
      data: {
        ...dadosPrisma,
        ...(categoriasIds !== undefined && {
          categorias: {
            set: categoriasIds.map((id) => ({ id }))
          }
        })
      },
      include: {
        categorias: {
          select: { id: true }
        }
      }
    });

    return this.mapToDto(produto as ProdutoDoBanco);
  }

  public async delete(id: string): Promise<ProdutoDTO> {
    const produtoDesconectado = await prisma.produto.update({
    where: {
      id: id,
    },
    data: {
      categorias: {
        set: []
      },
    },
    include: {
      categorias: { select: { id: true } }
    }
  }); ///com as conexoes com as categorias desfeitas, pode deletar o produto
    const produto = await prisma.produto.delete({
      where: { id },
      include: {
          categorias: { select: { id: true } }
      }
    });
    
    return this.mapToDto(produto as ProdutoDoBanco);
  }

  public async getAll(): Promise<ProdutoDTO[]> {
    const produtos = await prisma.produto.findMany({
      include: {
        categorias: {
          select: { id: true }
        }
      }
    });

    return produtos.map((p) => this.mapToDto(p as ProdutoDoBanco));
  }

  private mapToDto(produto: ProdutoDoBanco): ProdutoDTO {
    return {
      ...produto,
      categorias: produto.categorias.map((c) => c.id)
    };
  }
}

const produtoService = new ProdutoService();
export default produtoService;