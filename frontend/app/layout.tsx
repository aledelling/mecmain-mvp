import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Cargamos la fuente Inter (Google Fonts)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MecMain - SaaS para Talleres",
  description: "Sistema operativo para talleres de motocicletas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-background text-white min-h-screen font-sans antialiased selection:bg-primary selection:text-black">
        {/* 
            El fondo degradado ya está en globals.css en 'body', 
            pero aquí aseguramos clases base.
        */}
        {children}
      </body>
    </html>
  );
}