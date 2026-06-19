import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Trip Tribe",
  description: "Plan trips with your crew — vote, decide, go.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className={`${jakarta.className} min-h-screen antialiased`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
