import { describe, it, expect } from "vitest";
import ProdutoService from "@/app/(backend)/services/Produtos";

describe("ProdutoService", () => {
  it("deve criar um produto", async () => {
    const produto = await ProdutoService.create({
      nome: "Pão de Queijo",
      descricao: "Direto de Minas",
      preco: 6.0,
      imagem: ""
    });

    expect(produto).toHaveProperty("id");
    expect(produto.nome).toBe("Pão de Queijo");
    expect(produto.preco).toBe(6.0);
   });

  it("deve alterar produto", async () => {
    const produto = await ProdutoService.create({
      nome: "Pão de Queijo",
      descricao: "Direto de Minas",
      preco: 6.0,
      imagem: ""
    });
    const produtoId = produto.id;
      const atualizado = await ProdutoService.update(
      produtoId,
      {
        nome: "Pão de Carne",
        descricao: "Pão Quentinho",
        preco: 3.0
      }
    );

    expect(atualizado).toHaveProperty("id");
    expect(atualizado.nome).toBe("Pão de Carne");
    expect(atualizado.preco).toBe(3.0);
    expect(atualizado.descricao).toBe("Pão Quentinho");
  });
   it("deve deletar produto", async () => {
    const produto = await ProdutoService.create({
      nome: "Pão de Queijo",
      descricao: "Direto de Minas",
      preco: 6.0,
      imagem: ""
    });

    const produtoId = produto.id;

    const deletado = await ProdutoService.delete(produtoId);

    expect(deletado).toHaveProperty("id");
    expect(deletado.id).toBe(produtoId);
    const busca = await ProdutoService.getById(produtoId);
    expect(busca).toBeNull();
  });
  it("deve buscar um produto", async () => {
    const produto = await ProdutoService.create({
      nome: "Pão de Queijo",
      descricao: "Direto de Minas",
      preco: 6.0,
      imagem: ""
    });

    const produtoId = produto.id;

    const pegou = await ProdutoService.getById(produtoId);
    expect(pegou).not.toBeNull(); 
    expect(pegou).toHaveProperty("id");
    expect(pegou!.id).toBe(produtoId); //se nao é null, tem que ter id
  });
  it("deve buscar todos os produtos", async () => {
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

    const produto1Id = produto1.id;
    const produto2Id = produto2.id;

    const pegou = await ProdutoService.getAll();
    expect(pegou.some(p => p.id === produto1Id)).toBe(true); //testa se tem produto 1
    expect(pegou.some(p => p.id === produto2Id)).toBe(true); //testa se tem produto 2

  });
});
