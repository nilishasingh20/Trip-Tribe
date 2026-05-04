import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trip Tribe",
  description: "Group travel planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b border-neutral-200 bg-white px-4 py-3">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-900 hover:text-neutral-600"
          >
            Home
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
