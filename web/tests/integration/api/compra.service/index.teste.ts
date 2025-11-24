import { describe, it, expect } from "vitest";
import CompraService from "@/app/(backend)/services/compras";
import ProdutoService from "@/app/(backend)/services/Produtos";
import prisma from '@/app/(backend)/services/db';
import { afterEach } from "vitest";
afterEach(async () => {
  await prisma.categoria.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.categoria.deleteMany();
});
describe("CompraService", () => {
  it("deve criar uma compra", async () => {
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

    expect(compra).toHaveProperty("id");
    expect(compra.precoTotal).toBe(3);
    expect(compra.userId).toBe("kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5");
    expect(compra.status).toBe("PENDING");
  });

  it("deve alterar compra", async () => {
    const produto = await ProdutoService.create({
      nome: "Pão de Queijo",
      descricao: "Direto de Minas",
      preco: 6.0,
      imagem: ""
    });

    const compra = await CompraService.create(
      "kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5",
      [{ produtoId: produto.id }]
    );

    const atualizado = await CompraService.update(compra.id, {
      precoTotal: 5,
      userId: "myzrpOTm8Lj9ZDdU8GuZo4oZUZunshtY",
      status: "PAID",
    });

    expect(atualizado).toHaveProperty("id");
    expect(atualizado.precoTotal).toBe(5);
    expect(atualizado.status).toBe("PAID");
    expect(atualizado.userId).toBe("myzrpOTm8Lj9ZDdU8GuZo4oZUZunshtY");
  });

  it("deve deletar compra", async () => {
    const produto = await ProdutoService.create({
      nome: "Pão",
      descricao: "Bla",
      preco: 3,
      imagem: ""
    });

    const compra = await CompraService.create(
      "kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5",
      [{ produtoId: produto.id }]
    );

    const deletado = await CompraService.delete(compra.id);

    expect(deletado).toHaveProperty("id");
    expect(deletado.id).toBe(compra.id);

    const busca = await CompraService.getById(compra.id);
    expect(busca).toBeNull();
  });

  it("deve buscar uma compra", async () => {
    const produto = await ProdutoService.create({
      nome: "Pão",
      descricao: "Bla",
      preco: 3,
      imagem: ""
    });

    const compra = await CompraService.create(
      "kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5",
      [{ produtoId: produto.id }]
    );

    const pegou = await CompraService.getById(compra.id);

    expect(pegou).not.toBeNull();
    expect(pegou!.id).toBe(compra.id);
  });

  it("deve buscar todas as compras", async () => {
    const produto1 = await ProdutoService.create({
      nome: "Pão de Queijo",
      descricao: "Direto de Minas",
      preco: 6.0,
      imagem: ""
    });

    const produto2 = await ProdutoService.create({
      nome: "Pão de Forma",
      descricao: "Bla",
      preco: 5.0,
      imagem: ""
    });

    const compra1 = await CompraService.create(
      "kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5",
      [{ produtoId: produto1.id }]
    );

    const compra2 = await CompraService.create(
      "kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5",
      [{ produtoId: produto2.id }]
    );

    const pegou = await CompraService.getAll("kEc9akKbpkUnYUV2tmCaBVYvurEOFSh5");

    expect(pegou.some(p => p.id === compra1.id)).toBe(true);
    expect(pegou.some(p => p.id === compra2.id)).toBe(true);
  });
});
