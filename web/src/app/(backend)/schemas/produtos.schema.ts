import { z } from "zod";

export const produtoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Nome deve ter pelo menos 1 carácter")
    .max(15, "Nome deve ter no máximo 15 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  descricao: z
  .string()
  .trim()
  .min(6, "Descricao deve ter pelo menos 6 caracteres")
  .max(30, "Descricao deve ter no máximo 30 caracteres"),
  preco: z
  .number()
  .positive("Preço deve ser positivo"),
  imagem: z
  .string().optional(),
});