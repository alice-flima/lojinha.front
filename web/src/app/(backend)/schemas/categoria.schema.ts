import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z
    .string("Nome inválido")
    .trim()
    .min(1, "Nome deve ter pelo menos 1 caractere")
    .max(30, "Nome deve ter no máximo 30 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
});
