"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Tatil } from "@/lib/adminTypes";
import { para, tarihYaz } from "@/lib/tatilOzet";

interface TatilKarti extends Tatil {
  toplam: number;
  fisSayisi: number;
}

export default function AdminAnaSayfa() {
  const [tatiller, setTatiller] = useState<TatilKarti[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [ad, setAd] = useState("");
  const [baslangic, setBaslangic] = useState("");
  const [bitis, setBitis] = useState("");

  const yukle = useCallback(async () => {
    const [t, f] = await Promise.all([
      supabase.from("tatiller").select("*").order("baslangic", { ascending: false, nullsFirst: true }),
      supabase.from("fisler").select("tatil_id,toplam"),
    ]);
    if (t.error || f.error) {
      setHata((t.error ?? f.error)!.message);
      setYukleniyor(false);
      return;
    }
    const toplamlar = new Map<string, { toplam: number; adet: number }>();
    for (const fis of f.data) {
      const x = toplamlar.get(fis.tatil_id) ?? { toplam: 0, adet: 0 };
      x.toplam += Number(fis.toplam);
      x.adet += 1;
      toplamlar.set(fis.tatil_id, x);
    }
    setTatiller(
      (t.data as Tatil[]).map((x) => ({
        ...x,
        toplam: toplamlar.get(x.id)?.toplam ?? 0,
        fisSayisi: toplamlar.get(x.id)?.adet ?? 0,
      })),
    );
    setHata(null);
    setYukleniyor(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void yukle();
  }, [yukle]);

  async function tatilEkle(e: FormEvent) {
    e.preventDefault();
    if (!ad.trim()) return;
    const { error } = await supabase.from("tatiller").insert({
      ad: ad.trim(),
      baslangic: baslangic || null,
      bitis: bitis || null,
    });
    if (error) {
      setHata(error.message);
      return;
    }
    setAd("");
    setBaslangic("");
    setBitis("");
    await yukle();
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Tatiller</h1>

      {hata && (
        <p className="mb-4 rounded-lg bg-mercan/10 p-3 text-sm text-mercan">
          Hata: {hata}
        </p>
      )}

      <form
        onSubmit={tatilEkle}
        className="mb-6 rounded-2xl bg-white p-4 shadow-sm"
      >
        <h2 className="mb-3 font-semibold">Yeni tatil ekle</h2>
        <input
          value={ad}
          onChange={(e) => setAd(e.target.value)}
          placeholder="Örn: Marmaris Tekne Turu 2026"
          className="mb-3 w-full rounded-lg border border-navy/20 px-4 py-3"
        />
        <div className="mb-3 flex gap-3">
          <label className="flex-1 text-sm text-navy/70">
            Başlangıç
            <input
              type="date"
              value={baslangic}
              onChange={(e) => setBaslangic(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2.5"
            />
          </label>
          <label className="flex-1 text-sm text-navy/70">
            Bitiş
            <input
              type="date"
              value={bitis}
              onChange={(e) => setBitis(e.target.value)}
              className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2.5"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={!ad.trim()}
          className="w-full rounded-lg bg-turkuaz py-3 font-semibold text-white disabled:opacity-60"
        >
          Tatili Ekle
        </button>
      </form>

      {yukleniyor ? (
        <p className="py-8 text-center text-navy/50">Yükleniyor...</p>
      ) : tatiller.length === 0 ? (
        <p className="py-8 text-center text-navy/50">
          Henüz tatil yok. Yukarıdan ilkini ekle.
        </p>
      ) : (
        <ul className="space-y-3">
          {tatiller.map((t) => (
            <li key={t.id}>
              <Link
                href={`/admin/tatil/${t.id}`}
                className="block rounded-2xl bg-white p-4 shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-lg font-bold">{t.ad}</span>
                  <span className="font-semibold text-turkuaz">
                    {para(t.toplam)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-navy/60">
                  {tarihYaz(t.baslangic)} – {tarihYaz(t.bitis)} · {t.fisSayisi} fiş
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
