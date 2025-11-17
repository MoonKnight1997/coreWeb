import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Employment Tribunal Documents | AI-Powered Document Assistance",
  description: "Get professional assistance with Employment Tribunal documents. AI-powered agents help you prepare ET1 claims, witness statements, chronologies, and more.",
  keywords: "employment tribunal, ET1, witness statement, chronology, schedule of loss, legal documents, AI assistance",
  robots: "index, follow",
  authors: [{ name: "Employment Tribunal Documents" }],
  openGraph: {
    title: "Employment Tribunal Documents | AI-Powered Document Assistance",
    description: "Professional Employment Tribunal document preparation using specialized AI agents",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
