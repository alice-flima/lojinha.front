import { Resend } from "resend";
import { EmailTemplate } from "./email.template";
import { handleError } from "../api/errors/Erro";
import { NextResponse } from "next/server";


const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendEmail(to: string, subject: string, body: string){
  try {
    console.log("funcao chamada");
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",

      to,
      subject,
      react: EmailTemplate({ texto: body }),
    });
    
    if (error) {
      console.log("erro API Resend"); 
      const erroPadronizado = await handleError(error);
      throw erroPadronizado; 
    }
    console.log("enviado")
    return data;
  } catch (error) {
    const erroPadronizado = await handleError(error);
    throw erroPadronizado; 
  }
}