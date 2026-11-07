"use client";

import { useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { BIRIMLER, type Fis, type KalanUrun, type Tatil, type TatilNotu } from "@/lib/adminTypes";
import { markdownRapor, para, sayi, tarihYaz, tatilOzetiHesapla } from "@/lib/tatilOzet";

interface Props {
  tatil: Tatil;
  fisler: Fis[];
  notlar: TatilNotu[];
  kalanlar: KalanUrun[];
  onDegisti: () => void;
}

export default function OzetPaneli({ tatil, fisler, notlar, kalanlar, onDegisti }: Props) {
  const ozet = useMemo(() => tatilOzetiHesapla(fisler, kalanlar), [fisler, kalanlar]);
  const [urun, setUrun] = useState("");
  const [miktar, setMiktar] = useState("");
  const [birim, setBirim] = useState<string>("adet");
  const [hata, setHata] = useState<string | null>(null);

  async function kalanEkle(e: FormEvent) {
    e.preventDefault();
    const m = Number(miktar.replace(",", "."));
    if (!urun.trim() || !Number.isFinite(m) || m < 0) {
      return setHata("Ürün adı ve geçerli bir miktar girin.");
    }
    const { error } = await supabase
      .from("kalan_urunler")
      .insert({ tatil_id: tatil.id, urun: urun.trim(), miktar: m, birim });
    if (error) return setHata(error.message);
    setHata(null);
    setUrun("");
    setMiktar("");
    onDegisti();
  }

  async function kalanSil(k: KalanUrun) {
    const { error } = await supabase.from("kalan_urunler").delete().eq("id", k.id);
    if (error) return setHata(error.message);
    onDegisti();
  }

  function markdownIndir() {
    const metin = markdownRapor(tatil, ozet, fisler, notlar);
    const url = URL.createObjectURL(new Blob([metin], { type: "text/markdown;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tatil.ad.replace(/[^\p{L}\p{N}]+/gu, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const alan = "rounded-lg border border-navy/20 px-3 py-2.5";

  return (
    <div>
      <div className="mb-4 flex gap-3 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex-1 rounded-lg bg-navy py-3 font-semibold text-white"
        >
          Yazdır / PDF
        </button>
        <button
          onClick={markdownIndir}
          className="flex-1 rounded-lg bg-white py-3 font-semibold text-navy shadow-sm"
        >
          Markdown indir
        </button>
      </div>

      <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-xl font-bold">{tatil.ad}</h2>
        <p className="mb-3 text-sm text-navy/60">
          {tarihYaz(tatil.baslangic)} – {tarihYaz(tatil.bitis)}
        </p>
        <div className="flex gap-6">
          <div>
            <p className="text-sm text-navy/60">Toplam harcama</p>
            <p className="text-2xl font-bold text-turkuaz">{para(ozet.toplam)}</p>
          </div>
          <div>
            <p className="text-sm text-navy/60">Fiş</p>
            <p className="text-2xl font-bold">{ozet.fisSayisi}</p>
          </div>
        </div>
      </section>

      <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-bold">Marketlere göre</h3>
        {ozet.marketler.length === 0 ? (
          <p className="text-sm text-navy/50">Henüz fiş yok.</p>
        ) : (
          <ul className="space-y-1">
            {ozet.marketler.map((m) => (
              <li key={m.market} className="flex justify-between gap-3">
                <span>
                  {m.market} <span className="text-sm text-navy/50">({m.fisSayisi} fiş)</span>
                </span>
                <span className="font-semibold">{para(m.toplam)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-bold">Ürünler: alınan / kalan / tüketilen</h3>
        {ozet.urunler.length === 0 ? (
          <p className="text-sm text-navy/50">Henüz ürün kalemi yok.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-navy/60">
              <tr>
                <th className="py-1 font-medium">Ürün</th>
                <th className="py-1 text-right font-medium">Alınan</th>
                <th className="py-1 text-right font-medium">Kalan</th>
                <th className="py-1 text-right font-medium">Tüketilen</th>
              </tr>
            </thead>
            <tbody>
              {ozet.urunler.map((u) => (
                <tr key={u.anahtar} className="border-t border-navy/10">
                  <td className="py-1.5">{u.urun}</td>
                  <td className="py-1.5 text-right">{sayi(u.alinan)} {u.birim}</td>
                  <td className="py-1.5 text-right">{sayi(u.kalan)} {u.birim}</td>
                  <td className="py-1.5 text-right font-semibold">{sayi(u.tuketilen)} {u.birim}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-bold">Tatil sonu: artan / kalan ürünler</h3>
        <form onSubmit={kalanEkle} className="mb-3 flex flex-wrap gap-2 print:hidden">
          <input
            value={urun}
            onChange={(e) => setUrun(e.target.value)}
            placeholder="Ürün (fişteki adla aynı)"
            className={`${alan} min-w-0 flex-1 basis-full sm:basis-auto`}
          />
          <input
            inputMode="decimal"
            value={miktar}
            onChange={(e) => setMiktar(e.target.value)}
            placeholder="Miktar"
            className={`${alan} w-24`}
          />
          <select value={birim} onChange={(e) => setBirim(e.target.value)} className={`${alan} w-24 bg-white`}>
            {BIRIMLER.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg bg-turkuaz px-4 font-semibold text-white">
            Ekle
          </button>
        </form>
        {hata && <p className="mb-2 text-sm text-mercan">{hata}</p>}
        {kalanlar.length === 0 ? (
          <p className="text-sm text-navy/50">Henüz kalan ürün girilmedi.</p>
        ) : (
          <ul className="space-y-1">
            {kalanlar.map((k) => (
              <li key={k.id} className="flex justify-between gap-3">
                <span>{k.urun}</span>
                <span>
                  {sayi(Number(k.miktar))} {k.birim}{" "}
                  <button
                    onClick={() => kalanSil(k)}
                    aria-label="Sil"
                    className="ml-2 text-mercan print:hidden"
                  >
                    ×
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-bold">Notlar</h3>
        {notlar.length === 0 ? (
          <p className="text-sm text-navy/50">Henüz not yok.</p>
        ) : (
          <ul className="space-y-2">
            {notlar.map((n) => (
              <li key={n.id}>
                <span className="text-sm font-semibold text-turkuaz">{tarihYaz(n.tarih)}</span>
                <p className="whitespace-pre-wrap">{n.metin}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
