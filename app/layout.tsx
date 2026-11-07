import type { Metadata } from "next";
import { Dancing_Script } from "next/font/google";
import "./globals.css";

const scriptFont = Dancing_Script({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Ralazaba Tatilde",
  description: "14 kişilik tekne tatili ortak harcama takibi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`h-full ${scriptFont.variable}`}>
      <body className="min-h-full bg-kum text-navy antialiased">{children}</body>
    </html>
  );
}
