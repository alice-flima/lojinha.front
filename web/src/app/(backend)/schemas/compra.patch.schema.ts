import { z } from "zod";

export enum CompraStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}


export const compraStatusSchema = z.object({
  status: z.enum(CompraStatus).optional()
});
