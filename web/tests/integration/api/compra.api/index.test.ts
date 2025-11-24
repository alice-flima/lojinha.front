import { describe, it, expect } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import * as handler from "@/app/(backend)/api/compras/route";
import ProdutoService from "@/app/(backend)/services/Produtos";
import CompraService  from "@/app/(backend)/services/compras";
import { vi } from "vitest";
import prisma from '@/app/(backend)/services/db';
import { afterEach } from "vitest";
afterEach(async () => {
  await prisma.compraProduto.deleteMany();
  await prisma.compra.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.categoria.deleteMany();
});

// MOCK: pra testar o post compra precisa simular uma sessao
vi.mock("@/auth", () => {
  return {
    auth: {
      api: {
        getSession: vi.fn().mockResolvedValue({
          user: {
            id: "kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5",
            email: "teste@teste.com"
          }
        })
      }
    }
  };
});

describe("Rotas de Compra", () => {
  it("GET /api/compra pega compras do usuario", async () => {
      await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) => {
        return new Request(
          `http://localhost/api/compras?id=kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5`, //procuro pra esse id de user
          req
        );
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        const compras = await res.json();
        expect(res.status).toBe(200);
        expect(Array.isArray(compras)).toBe(true);
      },
    });
    
  });
  it("PUT /api/compra altera compra", async () => {
        const produto = await ProdutoService.create({
          nome: "Pão",
          descricao: "Bla",
          preco: 3,
          imagem: ""
        });
        const produto2 = await ProdutoService.create({
          nome: "Pão de Queijo",
          descricao: "Bla",
          preco: 4,
          imagem: ""
        });
    
        const compra = await CompraService.create(
          "kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5", // userId
          [{ produtoId: produto.id }]
        );
        const compraId  = compra.id;
      await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) => {
        return new Request(
          `http://localhost/api/compras?id=${compra.id}`, //procura id da compra criada
          req
        );
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            produtos: [produto2.id],
          }),
        });
        const compras = await res.json();
        expect(res.status).toBe(200);
        expect(compras.precoTotal).toBe(4.0);
      },
    });
  });
  it("PATCH /api/compra altera compra", async () => {
        const produto = await ProdutoService.create({
          nome: "Pão",
          descricao: "Bla",
          preco: 3,
          imagem: ""
        });
        const compra = await CompraService.create(
          "kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5", // userId
          [{ produtoId: produto.id }]
        );
        const compraId  = compra.id;
      await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) => {
        return new Request(
          `http://localhost/api/compras?id=${compra.id}`, //procura id da compra criada
          req
        );
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "PAID",
          }),
        });
        const compras = await res.json();
        expect(res.status).toBe(200);
        expect(compras.status).toBe("PAID");
      },
    });
  });
   it("POST /api/compra cria compra", async () => {
        const produto = await ProdutoService.create({
          nome: "Pão",
          descricao: "Bla",
          preco: 3,
          imagem: ""
        });
        
      await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) => {
        return new Request(
          `http://localhost/api/compras`, //cria para esse usuario
          req
        );
      },
      test: async ({ fetch }) => {
      const res = await fetch({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produtos: [produto.id],
        }),
      });
        const compra = await res.json();
        expect(res.status).toBe(201);
        expect(compra.precoTotal).toBe(3.0);
        expect(compra).toHaveProperty("id");
        expect(compra.userId).toBe("kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5");
      },
    });
  });
})