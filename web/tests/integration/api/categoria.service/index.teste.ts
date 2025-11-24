import { describe, it, expect } from "vitest";
import CategoriaService from "../../../../src/app/(backend)/services/categoria";

describe("CategoriaService", () => {
  
  it("deve criar uma categoria", async () => {
    const categoria = await CategoriaService.create({
      nome: "Queijos",
    });

    expect(categoria).toHaveProperty("id");
    expect(categoria.nome).toBe("Queijos");
  });
  it("deve alterar categoria", async () => {
      const categoria = await CategoriaService.create({
      nome: "Queijos",
    });
      const categoriaId = categoria.id;
        const atualizado = await CategoriaService.update(
        categoriaId,
        {
          nome: "Paes",
        }
      );
  
      expect(atualizado).toHaveProperty("id");
      expect(atualizado.nome).toBe("Paes");
    });

  it("deve deletar categoria", async () => {
    const categoria = await CategoriaService.create({
      nome: "Queijos",
    });

    const categoriaId = categoria.id;
    const deletado = await CategoriaService.delete(categoriaId);

    expect(deletado).toHaveProperty("id");
    expect(deletado.id).toBe(categoriaId);

    const busca = await CategoriaService.getById(categoriaId);
    expect(busca).toBeNull();
  });

  it("deve buscar uma categoria", async () => {
    const categoria = await CategoriaService.create({
      nome: "Queijos",
    });

    const categoriaId = categoria.id;
    const pegou = await CategoriaService.getById(categoriaId);

    expect(pegou).not.toBeNull();
    expect(pegou).toHaveProperty("id");
    expect(pegou!.id).toBe(categoriaId);
  });

  it("deve buscar todas as categorias", async () => {
    const categoria1 = await CategoriaService.create({
      nome: "Queijos",
    });

    const categoria2 = await CategoriaService.create({
      nome: "Queijos",
    });

    const pegou = await CategoriaService.getAll();

    expect(pegou.some(p => p.id === categoria1.id)).toBe(true);
    expect(pegou.some(p => p.id === categoria2.id)).toBe(true);
  });
});

