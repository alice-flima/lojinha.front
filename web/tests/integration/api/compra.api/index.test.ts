import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import { prismaMock, mockAuthSession } from "../mock/mockprisma";

vi.mock("@/app/(backend)/services/db", () => ({
  default: prismaMock,
}));
vi.mock("@/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(mockAuthSession),
    },
  },
}));
vi.mock("@/app/(backend)/Emails/email.status", () => ({
  sendEmail: vi.fn(),
}));
import * as handler from "@/app/(backend)/api/compras/route";
import { sendEmail } from "@/app/(backend)/Emails/email.status";
beforeEach(() => {
  vi.clearAllMocks();
});

describe("API /api/compra", () => {
  const produtoId1 = "507f1f77bcf86cd799439011";
  const produtoId2 = "507f191e810c19729de860ea";
  it("GET deve retornar lista de compras", async () => {
    (prismaMock.compra.findMany as Mock).mockResolvedValue([
      {
        id: "60f7f9d5e1b1f8b1f8b1f8b1",
        userId: mockAuthSession.user.id,
        precoTotal: 100,
        status: "PENDING",
      },
    ]);
    await testApiHandler({
      appHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: "GET" });
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json).toHaveLength(1);
      },
    });
  });

  it("POST deve criar compra com produtos válidos", async () => {
    const produtosInput = [produtoId1, produtoId2];
    (prismaMock.produto.findMany as Mock)
      .mockResolvedValueOnce([
        { id: produtoId1 },
        { id: produtoId2 },
      ])
      .mockResolvedValueOnce([
        { id: produtoId1, preco: 50 },
        { id: produtoId2, preco: 50 },
      ]);
    (prismaMock.compra.create as Mock).mockResolvedValue({
      id: "65f234c11223344556667788",
      precoTotal: 100,
      userId: mockAuthSession.user.id,
      status: "PENDING",
    });

    await testApiHandler({
      appHandler: handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ produtos: produtosInput }),
        });

        const json = await res.json();

        expect(res.status).toBe(201);
        expect(json.precoTotal).toBe(100);
        expect(prismaMock.produto.findMany).toHaveBeenCalledTimes(2);
      },
    });
  });

  it("PATCH deve atualizar status e enviar email", async () => {
    const compraId = "507f191e810c19729de860fe";
    const novoStatus = "PAID";
    (prismaMock.compra.update as Mock).mockResolvedValue({
      id: compraId,
      precoTotal: 300,
      status: novoStatus,
      userId: mockAuthSession.user.id,
    });
    (prismaMock.compra.findUnique as Mock).mockResolvedValue({
      id: compraId,
      userId: mockAuthSession.user.id,
      status: novoStatus,
      precoTotal: 300,
    });
    (prismaMock.user.findUnique as Mock).mockResolvedValue({
      id: mockAuthSession.user.id,
      email: "teste@email.com",
    });

    await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) =>
        new Request(`http://localhost/api/compra?id=${compraId}`, req),
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: novoStatus }),
        });
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(json.status).toBe(novoStatus);
        expect(sendEmail).toHaveBeenCalled();
      },
    });
  });
  it("PUT deve atualizar produtos e recalcular preço", async () => {
  const compraId = "507f191e810c19729de860fe";
  const produtoId1 = "507f191e810c19729de860aa";
  const produtoId2 = "507f191e810c19729de860bb";
  (prismaMock.produto.findMany as Mock)
    .mockResolvedValueOnce([
      { id: produtoId1 },
      { id: produtoId2 }
    ])
    .mockResolvedValueOnce([
      { preco: 50 },
      { preco: 25 }
    ]);

  prismaMock.$transaction.mockImplementation(async (callback: any) => {
    return callback(prismaMock);
  });
  (prismaMock.compraProduto.deleteMany as Mock).mockResolvedValue({ count: 2 });
  (prismaMock.compraProduto.create as Mock).mockResolvedValue({});
  (prismaMock.compra.update as Mock).mockResolvedValue({
    id: compraId,
    precoTotal: 75,
    status: "PENDING",
    produtos: [
      { produtoId: produtoId1 },
      { produtoId: produtoId2 }
    ]
  });

  await testApiHandler({
    appHandler: handler,
    requestPatcher: (req) =>
      new Request(`http://localhost/api/compra?id=${compraId}`, req),
    test: async ({ fetch }) => {
      const res = await fetch({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produtos: [produtoId1, produtoId2]
        })
      });
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.precoTotal).toBe(75);
      expect(prismaMock.compraProduto.deleteMany).toHaveBeenCalled();
      expect(prismaMock.compraProduto.create).toHaveBeenCalledTimes(2);
      expect(prismaMock.compra.update).toHaveBeenCalled();
    }
  });

});

  it("DELETE deve excluir compra corretamente", async () => {
    const compraId = "507f191e810c19729de860ff";
    (prismaMock.compraProduto.deleteMany as Mock).mockResolvedValue({ count: 2 });
    (prismaMock.compra.delete as Mock).mockResolvedValue({
      id: compraId,
      status: "CANCELLED",
    });
    await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) =>
        new Request(`http://localhost/api/compra?id=${compraId}`, req),
      test: async ({ fetch }) => {
        const res = await fetch({ method: "DELETE" });
        expect(res.status).toBe(200);
        expect(prismaMock.compra.delete).toHaveBeenCalled();
      },
    });
  });
});
