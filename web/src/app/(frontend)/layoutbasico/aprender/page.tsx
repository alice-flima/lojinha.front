'use client'

import type { Metadata } from "next"
import React from "react"
import { useState } from "react";
import Header from "@/components/Header";
import Carrinho from "@/components/Carrinho";
import ListaProdutos from "@/components/ListaProdutos";



import { Rubik } from "next/font/google"



const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
})



export default function Page() {
  const [verCarrinho, setVerCarrinho] = useState(false);

  const PageContent = verCarrinho ? <Carrinho /> : <ListaProdutos />;

  console.log("Carrinho:", Carrinho);
  console.log("ListaProdutos:", ListaProdutos);

  return (
    <>
      <Header verCarrinho={verCarrinho} setVerCarrinho={setVerCarrinho} />
      {PageContent}
    </>
  );
}