import type { Metadata } from "next";
import "./globals.css";
// import { Header } from "@/components/Header";
import { Header } from "../app/componentes/Header";
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "Feirô",
  description: "Site de venda de Hortifrutis em Pelotas/RS",
  keywords: ["fruta", "hortifruti", "legumes", "hortalicias", "Pelotas"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <Header />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

// esse arquivo define o que deve ser renderizado apartir desse diretorio  onde vai por o que o page esta retornando
