import { describe, it, expect } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import * as handler from "@/app/(backend)/api/produtos/route";
import ProdutoService from "@/app/(backend)/services/Produtos";

describe("Rotas de Produto", () => {

  it("GET /api/produtos retorna lista de produtos", async () => {
    await testApiHandler({
      appHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });

        expect(res.status).toBe(200);
        const body = await res.json();

        expect(Array.isArray(body)).toBe(true);
      },
    });
  });

  it("POST /api/produtos retorna um produto criado", async () => {
    await testApiHandler({
      appHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: "Pao de Queijo",
            descricao: "Mineiro",
            preco: 5.0,
            imagem: ""
          }),
        });

        expect(res.status).toBe(201);
        const body = await res.json();

        expect(body).toHaveProperty("id");
        expect(typeof body).toBe("object");
      },
    });
  });

  it("POST /api/produtos retorna erro com body incompleto", async () => {
    await testApiHandler({
      appHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: "Pao de Queijo",
            descricao: "Mineiro",  
            /// sem preco
            imagem: ""
          }),
        });

        expect(res.status).toBe(400);
      },
    });
  });
it("DELETE /api/produtos deleta um produto", async () => {
  let produtoId = "";
  await testApiHandler({
    appHandler: handler,
    test: async ({ fetch }) => {
      const createRes = await fetch({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Pao de Queijo",
          descricao: "Mineiro",
          preco: 5.0,
          imagem: ""
        }),
      });

      const produto = await createRes.json();
      produtoId = produto.id;
    },
  });

  await testApiHandler({
    appHandler: handler,
    requestPatcher: (req) => {
      return new Request(
        `http://localhost/api/produtos?id=${produtoId}`,
        req
      );
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const deleted = await res.json();
      const busca = await ProdutoService.getById(produtoId);
      expect(busca).toBeNull();
      expect(res.status).toBe(200);
      expect(deleted.id).toBe(produtoId);
    },
  });
});
it("PUT /api/produtos atualiza um produto", async () => {
  let produtoId = "";

  await testApiHandler({
    appHandler: handler,
    test: async ({ fetch }) => {
      const createRes = await fetch({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Pao de Queijo",
          descricao: "Mineiro",
          preco: 5.0,
          imagem: ""
        }),
      });

      const produto = await createRes.json();
      produtoId = produto.id;
    },
  });

  await testApiHandler({
    appHandler: handler,
    requestPatcher: (req) => {
      return new Request(
        `http://localhost/api/produtos?id=${produtoId}`,
        req
      );
    },
    test: async ({ fetch }) => {
      const res = await fetch({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Pao de Queijo",
          descricao: "Mineiro",
          preco: 4.0,
          imagem: ""
        }),
      });

      const updated = await res.json();

      expect(res.status).toBe(200);
      expect(updated.id).toBe(produtoId);
      expect(updated.preco).toBe(4.0);
      expect(updated.descricao).toBe("Mineiro");
      expect(updated.nome).toBe("Pao de Queijo");
    },
  });
});

  });
