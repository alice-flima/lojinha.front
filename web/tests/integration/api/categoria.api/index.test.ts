import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import prismaCategoriaMock from "../mock/categoriaprismamock";

vi.mock("@/app/(backend)/services/db", () => ({
  default: prismaCategoriaMock
}));
vi.mock("@/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: { id: "usuario", email: "teste@email.com" }
      })
    }
  }
}));
import * as handler from "@/app/(backend)/api/categorias/route";
beforeEach(() => {
  vi.clearAllMocks();
});
describe("API /api/categorias", () => {
  const categoriaId = "507f191e810c19729de860aa";
  const produtoId = "507f191e810c19729de86111";
  it("GET", async () => {
    (prismaCategoriaMock.categoria.findMany as Mock).mockResolvedValue([
      {
        id: categoriaId,
        nome: "Queijos",
        produtos: [{ id: produtoId }]
      }
    ]);

    await testApiHandler({
      appHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json[0].id).toBe(categoriaId);
      }
    });
  });
  it("POST", async () => {
    (prismaCategoriaMock.categoria.create as Mock).mockResolvedValue({
      id: categoriaId,
      nome: "Doces",
      produtos: [{ id: produtoId }]
    });
    await testApiHandler({
      appHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: "Doces", produtos: [produtoId] })
        });

        const json = await res.json();
        expect(res.status).toBe(201);
        expect(json.nome).toBe("Doces");
      }
    });
  });
  it("PUT", async () => {
    (prismaCategoriaMock.categoria.update as Mock).mockResolvedValue({
      id: categoriaId,
      nome: "Paes",
      produtos: [{ id: produtoId }]
    });
    await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) =>
        new Request(`http://localhost/api/categorias?id=${categoriaId}`, req),
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: "Paes", produtos: [produtoId] })
        });
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json.nome).toBe("Paes");
      }
    });
  });

  it("DELETE", async () => {
    (prismaCategoriaMock.categoria.update as Mock).mockResolvedValue({
      id: categoriaId,
      nome: "sla",
      produtos: []
    });

    (prismaCategoriaMock.categoria.delete as Mock).mockResolvedValue({
      id: categoriaId,
      nome: "sla",
      produtos: []
    });

    await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) =>
        new Request(`http://localhost/api/categorias?id=${categoriaId}`, req),
      test: async ({ fetch }) => {
        const res = await fetch({ method: "DELETE" });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.id).toBe(categoriaId);
      }
    });
  });

});
