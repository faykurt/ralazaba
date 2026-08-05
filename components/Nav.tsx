"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartIcon, SailboatIcon, TekneManzarasi, WaveIcon } from "./icons";

const SEKMELER = [
  { href: "/", etiket: "Ana Sayfa", Icon: WaveIcon },
  { href: "/ozet", etiket: "Özet", Icon: ChartIcon },
] as const;

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="relative overflow-hidden">
      <TekneManzarasi className="absolute inset-0 h-full w-full" />

      <div className="relative mx-auto flex max-w-2xl items-center gap-2 px-4 pt-5 pb-2">
        <SailboatIcon className="h-8 w-8 text-navy" />
        <span className="font-script text-3xl leading-none text-navy">
          Ralazaba Tatilde
        </span>
      </div>

      <nav className="relative mx-auto flex max-w-2xl gap-2 px-4 pb-2">
        {SEKMELER.map(({ href, etiket, Icon }) => {
          const aktif = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full border-b-[3px] py-2.5 text-sm font-semibold backdrop-blur-sm transition-colors ${
                aktif
                  ? "border-turkuaz bg-white/70 text-navy"
                  : "border-transparent bg-white/40 text-navy/60"
              }`}
            >
              <Icon className="h-4 w-4" />
              {etiket}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
