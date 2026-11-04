import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generador de Propuestas – IntegraIA by EMET",
  description:
    "Crea en minutos propuestas profesionales de servicios de inteligencia artificial para pymes mexicanas.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#060d1f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-navy-950 font-sans text-slate-100 antialiased">{children}</body>
    </html>
  );
}
