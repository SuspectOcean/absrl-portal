import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ABSRL | Antigua & Barbuda Sim Racing League",
  description:
    "Join the official Gran Turismo 7 esports league of Antigua & Barbuda. Compete in elite racing competitions, world-class drivers, and championship glory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-screen flex flex-col bg-racing-black text-gray-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
