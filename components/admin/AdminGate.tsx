"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { SailboatIcon } from "@/components/icons";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const { yukleniyor, girisYapildi, giris, cikis } = useAdminAuth();
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    setGonderiliyor(true);
    try {
      await giris(kullaniciAdi, sifre);
      setSifre("");
    } catch (err) {
      setHata(err instanceof Error ? err.message : "Giriş yapılamadı.");
    } finally {
      setGonderiliyor(false);
    }
  }

  if (yukleniyor) {
    return <p className="py-24 text-center text-navy/50">Yükleniyor...</p>;
  }

  if (!girisYapildi) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-navy px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
        >
          <SailboatIcon className="mx-auto mb-1 h-10 w-10 text-navy" />
          <h1 className="font-script mb-1 text-center text-4xl text-navy">
            Ralazaba Admin
          </h1>
          <p className="mb-6 text-center text-sm text-navy/60">
            Tatil kayıtları için giriş yapın
          </p>
          <label className="mb-3 block">
            <span className="mb-1 block text-sm font-medium text-navy/70">
              Kullanıcı adı
            </span>
            <input
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              value={kullaniciAdi}
              onChange={(e) => setKullaniciAdi(e.target.value)}
              className="w-full rounded-lg border border-navy/20 px-4 py-3"
            />
          </label>
          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-medium text-navy/70">
              Şifre
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="w-full rounded-lg border border-navy/20 px-4 py-3"
            />
          </label>
          {hata && <p className="mb-3 text-sm text-mercan">{hata}</p>}
          <button
            type="submit"
            disabled={gonderiliyor || !kullaniciAdi || !sifre}
            className="w-full rounded-lg bg-turkuaz py-3 text-lg font-semibold text-white active:scale-[0.98] disabled:opacity-60"
          >
            {gonderiliyor ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-4 pb-16">
      <header className="mb-6 flex items-center justify-between gap-2 print:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <SailboatIcon className="h-8 w-8 text-navy" />
          <span className="font-script text-3xl leading-none text-navy">
            Ralazaba Admin
          </span>
        </Link>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link href="/" className="text-navy/60">
            Uygulama
          </Link>
          <button onClick={cikis} className="text-mercan">
            Çıkış
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
