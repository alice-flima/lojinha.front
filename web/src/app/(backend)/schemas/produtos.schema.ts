import { z } from "zod";

export const produtoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  descricao: z
    .string()
    .trim()
    .min(10, "Descrição muito curta (min 10)")
    .max(1000, "Descrição muito longa (max 1000)"),
  preco: z
    .string("O preço é obrigatório" )
    .regex(/^\d+(\.\d+)?$/, "O preço deve ser um número válido"), 
  imagem: z.string().optional(),
  categorias: z
    .array(
      z.string().regex(/^[a-fA-F0-9]{24}$/, "Id de categoria inválido")
    )
    .optional(),
});