import { z } from "zod";

export const categoriaSchema = z.object({
  nome: z
    .string("A categoria deve ter um nome")
    .trim()
    .min(1, "Nome deve ter pelo menos 1 carácter")
    .max(15, "Nome deve ter no máximo 15 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  produtos: z
  .array(z.string())
  .optional(),
});
