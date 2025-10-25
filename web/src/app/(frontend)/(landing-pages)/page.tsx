import LandingPagesNav from "@/components/nav/InitialNav";
import Entrar from "./Entrar";
import { headers } from "next/headers";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const isLogged = !!session?.user;

  return (
    <div className="min-h-screen">
      <LandingPagesNav  />
      
      <main className="h-[70vh] w-full pt-20 pb-16
      flex items-center justify-center gap-24 xl:gap-30">
       

        <div className="flex flex-col gap-6">
          <h1 className="font-bold text-5xl">Padaria</h1>
        </div>
      </main>

      <Entrar />

    </div>
  );
}