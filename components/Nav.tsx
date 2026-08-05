"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SEKMELER = [
  { href: "/", etiket: "Ana Sayfa" },
  { href: "/ozet", etiket: "Özet" },
] as const;

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="bg-navy text-kum shadow-md">
      <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 pt-4 pb-1">
        <span className="text-xl">⛵</span>
        <span className="text-lg font-bold tracking-wide">
          Ralazaba Tatilde
        </span>
      </div>
      <nav className="mx-auto flex max-w-2xl px-4">
        {SEKMELER.map((s) => {
          const aktif = pathname === s.href;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`flex-1 border-b-2 py-3 text-center text-sm font-semibold transition-colors ${
                aktif
                  ? "border-turkuaz text-turkuaz"
                  : "border-transparent text-kum/60"
              }`}
            >
              {s.etiket}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
