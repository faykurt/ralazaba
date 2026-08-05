import type { Metadata } from "next";
import { Dancing_Script } from "next/font/google";
import "./globals.css";
import PinGate from "@/components/PinGate";
import Nav from "@/components/Nav";
import { KumsalSeridi } from "@/components/icons";

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
      <body className="min-h-full bg-kum text-navy antialiased">
        <PinGate>
          <Nav />
          <KumsalSeridi className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-16 w-full text-turkuaz" />
          <main className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-4 pb-28">
            {children}
          </main>
        </PinGate>
      </body>
    </html>
  );
}
