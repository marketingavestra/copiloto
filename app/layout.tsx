import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Copiloto Jurídico — IA para Advogados | Dr. Wladmir Bonadio Filho",
  description: "Tenha um Copiloto Jurídico de IA trabalhando por você 24/7. Pesquise jurisprudência, redija peças e acompanhe prazos com inteligência artificial treinada para o Direito Brasileiro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
