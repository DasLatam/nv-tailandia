import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NV Tailandia",
  description: "Mapa interactivo y guía visual del viaje a Tailandia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
