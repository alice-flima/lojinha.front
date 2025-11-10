import { z } from "zod";

export enum CompraStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}


export const compraSchema = z.object({
  produtos: z.array(
    z.string()
      .min(1, "Id do produto é obrigatório")
      .regex(/^[a-fA-F0-9]{24}$/, "Id inválido")
  ).nonempty("Não é possível criar uma compra vazia"),
  status: z.enum(CompraStatus).optional()
});
