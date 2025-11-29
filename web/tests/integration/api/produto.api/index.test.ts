import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";

vi.mock("@/app/(backend)/services/Produtos", () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));
vi.mock("@/app/(backend)/schemas/produtos.schema", () => ({
  produtoSchema: {
    safeParse: vi.fn()
  }
}));
vi.mock("@/app/(backend)/api/errors/Erro", () => ({
  handleError: vi.fn()
}));
import * as handler from "@/app/(backend)/api/produtos/route";
import ProdutoService from "@/app/(backend)/services/Produtos";
import { produtoSchema } from "@/app/(backend)/schemas/produtos.schema";

type ProdutoDTO = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categorias: string[];
};

beforeEach(() => {
  vi.clearAllMocks();
});

const produtoMock: ProdutoDTO = {
  id: "produtoId",
  nome: "Pão de queijo",
  descricao: "Mineiro",
  preco: 5,
  imagem: "",
  categorias: []
};

describe("Rotas de Produto ", () => {
  it("GET /api/produtos retorna lista", async () => {
    (ProdutoService.getAll as Mock).mockResolvedValue([produtoMock]);
    await testApiHandler({
      appHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json.length).toBe(1);
        expect(json[0].id).toBe("produtoId");
      }
    });
  });

  it("POST /api/produtos cria produto", async () => {
    (produtoSchema.safeParse as Mock).mockReturnValue({
      success: true,
      data: produtoMock
    });

    (ProdutoService.create as Mock).mockResolvedValue(produtoMock);
    await testApiHandler({
      appHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(produtoMock)
        });
        const json = await res.json();
        expect(res.status).toBe(201);
        expect(json.nome).toBe("Pão de queijo");
      }
    });
  });


  it("PUT /api/produtos atualiza", async () => {
    const atualizado = { ...produtoMock, preco: 4 };
    (produtoSchema.safeParse as Mock).mockReturnValue({
      success: true,
      data: atualizado
    });
    (ProdutoService.update as Mock).mockResolvedValue(atualizado);
    await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) =>
        new Request(`http://localhost/api/produtos?id=${atualizado.id}`, req),
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(atualizado)
        });
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json.preco).toBe(4);
      }
    });
  });

  it("DELETE /api/produtos", async () => {
    (ProdutoService.delete as Mock).mockResolvedValue(produtoMock);
    await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) =>
        new Request(`http://localhost/api/produtos?id=${produtoMock.id}`, req),

      test: async ({ fetch }) => {
        const res = await fetch({ method: "DELETE" });
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json.id).toBe("produtoId");
      }
    });
  });

});
