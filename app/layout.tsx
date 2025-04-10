import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Star Wars Fleet Management",
  description: "Manage and compare Star Wars starships",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <div className="min-h-screen bg-background">
            <header className="border-b">
              <div className="container mx-auto py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Star Wars Fleet</h1>
              </div>
            </header>
            <main>{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
