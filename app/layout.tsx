import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KippGO | Gestão inteligente para academias",
  description: "Gestão de alunos, treinos, metas, avaliações e retenção em uma única plataforma.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
