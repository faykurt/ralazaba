import type { Metadata } from "next";
import "./globals.css";
import PinGate from "@/components/PinGate";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Ralazaba Tatilde",
  description: "14 kişilik tekne tatili ortak harcama takibi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full bg-kum text-navy antialiased">
        <PinGate>
          <Nav />
          <main className="mx-auto w-full max-w-2xl px-4 pt-4 pb-28">
            {children}
          </main>
        </PinGate>
      </body>
    </html>
  );
}
