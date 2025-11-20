import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { handleError } from "../errors/Erro";

const client = new S3Client({
  region: process.env.AWS_REGION!,
  forcePathStyle: true, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: NextRequest) {
  try{
  const file = request.nextUrl.searchParams.get("file");

  if (!file) {
    const erro = await handleError(new ZodError([]));
    return NextResponse.json(erro, { status: erro.statusCode });
  }

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: file,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 3600 });

  return new NextResponse(url, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
} catch (error) {
      const erro = await handleError(error);
      return NextResponse.json(erro, { status: erro.statusCode });
  
    }
}
