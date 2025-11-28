import { describe, it, expect } from "vitest";
import { testApiHandler } from "next-test-api-route-handler";
import * as handler from "@/app/(backend)/api/categorias/route";
import CategoriaService  from "@/app/(backend)/services/categoria";
import  ProdutoService  from "@/app/(backend)/services/Produtos";
import prisma from '@/app/(backend)/services/db';
import { afterEach } from "vitest";


afterEach(async () => {
  await prisma.categoria.deleteMany();
  await prisma.produto.deleteMany();
});





describe("Rotas de Categoria", () => {
  it("DELETE /api/categorias deleta uma categoria", async () => {
      const categoria = await CategoriaService.create({
          nome: "Queijos",
        });
     const categoriaId = categoria.id;   
      await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) => {
        return new Request(
          `http://localhost/api/categorias?id=${categoriaId}`, 
          req
        );
      },
      test: async ({ fetch }) => {
      const res = await fetch({
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
        const deletado = await res.json();
        const busca = await CategoriaService.getById(categoriaId);
        expect(busca).toBeNull();
        expect(res.status).toBe(200);
        expect(deletado.id).toBe(categoriaId);
        
      },
    });
    
  });
  
  it("GET /api/categorias pega categorias", async () => {
    
      await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) => {
        return new Request(
          `http://localhost/api/categorias`, 
          req
        );
      },
       
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const categorias = await res.json();
        expect(Array.isArray(categorias)).toBe(true);
        expect(res.status).toBe(200);
      },
    });
  });
  it("PUT /api/categorias altera categoria", async () => {
    const categoria1 = await CategoriaService.create({
          nome: "Queijos",
        });
    const produto = await ProdutoService.create({
               nome: "Pão",
               descricao: "Bla",
               preco: 3,
               imagem: ""
         });  
     const produtoId = produto.id;     
     const categoriaId = categoria1.id;   
      await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) => {
        return new Request(
          `http://localhost/api/categorias?id=${categoriaId}`, 
          req
        );
      },
      test: async ({ fetch }) => {
      const res = await fetch({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Paes doces",
          produtos: [produtoId],

        }),
      });
        const categoria = await res.json();
        expect(res.status).toBe(200);
        expect(categoria.id).toBe(categoriaId);
        expect(categoria).toHaveProperty("produtos");
        expect(categoria.nome).toBe("Paes doces");
        expect(categoria.produtos.map((p: { produtoId: string }) => p.produtoId)).toContain(produto.id);

      },
    });
  });
   it("POST /api/categorias cria categoria", async () => {
    const produto = await ProdutoService.create({
               nome: "Doce",
               descricao: "Bla",
               preco: 3,
               imagem: ""
         });  
     const produtoId = produto.id;  
      await testApiHandler({
      appHandler: handler,
      requestPatcher: (req) => {
        return new Request(
          `http://localhost/api/categorias`, 
          req
        );
      },
      test: async ({ fetch }) => {
      const res = await fetch({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: "Queijos",
          produtos: [produtoId],

        }),
      });
        const categoria = await res.json();
        expect(res.status).toBe(201);
        expect(categoria).toHaveProperty("id");
        expect(categoria).toHaveProperty("produtos");
        expect(categoria.nome).toBe("Queijos");
        expect(categoria.produtos.map((p: { produtoId: string }) => p.produtoId)).toContain(produto.id);
      },
    });
  });
})