'use client'

import type { Metadata } from "next"
import React from "react"
import { useState } from "react"
import Carrinho from "../components/Carrinho"
import ListaProdutos from "../components/ListaProdutos"
import { Rubik } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/common/ToastProvider"
import Header from "@/components/Header"

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
})



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${rubik.variable} antialiased`}
      >
        {children}

        <ToastProvider />
      </body>
    </html>
  );
}

