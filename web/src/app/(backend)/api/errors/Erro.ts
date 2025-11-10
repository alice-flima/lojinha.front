import { ZodError } from "zod";
import { BetterAuthError } from "better-auth"

export async function handleError(error: unknown){
if (error instanceof ZodError) {
return {
  "success": false,
  "message": "Erro de validação",
  statusCode: 400
}
}
if (error instanceof BetterAuthError){
return {
  "success": false,
  "message": "Erro de autenticação",
  statusCode:401
}
}
return {
  "success": false,
  "message": "Erro inesperado",
  statusCode: 500
}
}