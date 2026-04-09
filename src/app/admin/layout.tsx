import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | ABSRL",
  description: "Antigua & Barbuda Sim Racing League - Admin Portal",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-screen flex flex-col bg-racing-black text-gray-200">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
