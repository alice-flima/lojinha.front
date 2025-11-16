import { Resend } from "resend";
import { EmailTemplate } from "./email.template";


const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendEmail(to: string, subject: string, body: string){
  try {
    const { data, error } = await resend.emails.send({
      from: 'Alice <aliceflima19@gmail.com>',
      //from: "Acme <onboarding@resend.dev>" para teste

      to,
      subject,
      react: EmailTemplate({ texto: body }),
    });

    if (error) {
      console.error("Erro ao enviar email:", error);
      return Response.json({ error }, { status: 500 });
    }

    return data;
  } catch (error) {
    console.error("Erro :", error);
    return Response.json({ error }, { status: 500 });
  }
}