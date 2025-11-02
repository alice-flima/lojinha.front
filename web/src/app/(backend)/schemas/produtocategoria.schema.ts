import { z } from "zod";

export const produtocategoriaSchema = z.object({
  produtoId: z
    .string()
    .min(1, "Id precisa ter pelo menos um caracter")
    .regex(/^[a-fA-F0-9]{24}$/, "Id inválido"),
   categoriaId: z
    .string()
    .min(1, "Id precisa ter pelo menos um caracter")
    .regex(/^[a-fA-F0-9]{24}$/, "Id inválido"),
});