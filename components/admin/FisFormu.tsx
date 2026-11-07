"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { BIRIMLER } from "@/lib/adminTypes";
import { para } from "@/lib/tatilOzet";

interface KalemTaslak {
  urun: string;
  miktar: string;
  birim: string;
  fiyat: string;
}

interface Props {
  tatilId: string;
  onKaydedildi: () => void;
  onKapat: () => void;
}

const bosKalem = (): KalemTaslak => ({ urun: "", miktar: "1", birim: "adet", fiyat: "" });
const FOTO_LIMIT = 8 * 1024 * 1024;

const sayiOku = (v: string) => {
  const n = Number(v.trim().replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
};

export default function FisFormu({ tatilId, onKaydedildi, onKapat }: Props) {
  const [market, setMarket] = useState("");
  const [tarih, setTarih] = useState(() => new Date().toISOString().slice(0, 10));
  const [toplam, setToplam] = useState("");
  const [notMetni, setNotMetni] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [kalemler, setKalemler] = useState<KalemTaslak[]>([bosKalem()]);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  const dolular = kalemler.filter((k) => k.urun.trim());
  const kalemToplami = dolular.reduce((t, k) => {
    const f = sayiOku(k.fiyat);
    const m = sayiOku(k.miktar);
    return Number.isFinite(f) && Number.isFinite(m) ? t + f * m : t;
  }, 0);

  function kalemGuncelle(i: number, alan: keyof KalemTaslak, deger: string) {
    setKalemler((onceki) =>
      onceki.map((k, idx) => (idx === i ? { ...k, [alan]: deger } : k)),
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setHata(null);

    if (!market.trim()) return setHata("Market / yer adını girin.");
    const toplamSayi = toplam.trim() ? sayiOku(toplam) : kalemToplami;
    if (!Number.isFinite(toplamSayi) || toplamSayi <= 0)
      return setHata("Fiş toplamını girin (ya da kalemlere fiyat yazın).");
    for (const k of dolular) {
      const m = sayiOku(k.miktar);
      if (!Number.isFinite(m) || m <= 0)
        return setHata(`"${k.urun}" için geçerli bir miktar girin.`);
      if (k.fiyat.trim() && !(sayiOku(k.fiyat) >= 0))
        return setHata(`"${k.urun}" için geçerli bir fiyat girin.`);
    }
    if (foto && foto.size > FOTO_LIMIT)
      return setHata("Fotoğraf 8 MB'tan küçük olmalı.");

    setKaydediliyor(true);
    let yuklenenYol: string | null = null;
    try {
      if (foto) {
        const uzanti = (foto.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
        yuklenenYol = `${tatilId}/${crypto.randomUUID()}.${uzanti || "jpg"}`;
        const { error } = await supabase.storage
          .from("fisler")
          .upload(yuklenenYol, foto, { contentType: foto.type || undefined });
        if (error) throw error;
      }

      const { data: fis, error: fisHata } = await supabase
        .from("fisler")
        .insert({
          tatil_id: tatilId,
          market: market.trim(),
          tarih,
          toplam: toplamSayi,
          foto_yolu: yuklenenYol,
          not_metni: notMetni.trim() || null,
        })
        .select("id")
        .single();
      if (fisHata) throw fisHata;

      if (dolular.length > 0) {
        const { error: kalemHata } = await supabase.from("fis_kalemleri").insert(
          dolular.map((k) => ({
            fis_id: fis.id,
            urun: k.urun.trim(),
            miktar: sayiOku(k.miktar),
            birim: k.birim,
            fiyat: k.fiyat.trim() ? sayiOku(k.fiyat) : null,
          })),
        );
        if (kalemHata) {
          await supabase.from("fisler").delete().eq("id", fis.id);
          throw kalemHata;
        }
      }
      onKaydedildi();
    } catch (err) {
      if (yuklenenYol) await supabase.storage.from("fisler").remove([yuklenenYol]);
      setHata(err instanceof Error ? err.message : "Kaydedilemedi, tekrar deneyin.");
      setKaydediliyor(false);
    }
  }

  const alan = "w-full rounded-lg border border-navy/20 px-3 py-2.5";

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-navy/50 sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[94vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
      >
        <h2 className="mb-4 text-xl font-bold">Yeni Fiş</h2>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-navy/70">Market / yer</span>
          <input
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            placeholder="Örn: Migros, Manav, Balıkçı"
            className={alan}
          />
        </label>

        <div className="mb-3 flex gap-3">
          <label className="flex-1">
            <span className="mb-1 block text-sm font-medium text-navy/70">Tarih</span>
            <input type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} className={alan} />
          </label>
          <label className="flex-1">
            <span className="mb-1 block text-sm font-medium text-navy/70">Fiş toplamı (TL)</span>
            <input
              inputMode="decimal"
              value={toplam}
              onChange={(e) => setToplam(e.target.value)}
              placeholder={kalemToplami > 0 ? kalemToplami.toFixed(2) : "0,00"}
              className={alan}
            />
          </label>
        </div>

        <div className="mb-3">
          <span className="mb-1 block text-sm font-medium text-navy/70">
            Alınan ürünler (isteğe bağlı)
          </span>
          <ul className="space-y-2">
            {kalemler.map((k, i) => (
              <li key={i} className="rounded-lg bg-kum p-2">
                <div className="mb-2 flex gap-2">
                  <input
                    value={k.urun}
                    onChange={(e) => kalemGuncelle(i, "urun", e.target.value)}
                    placeholder="Ürün (örn: Su 5 lt)"
                    className={`${alan} flex-1`}
                  />
                  {kalemler.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setKalemler((o) => o.filter((_, idx) => idx !== i))}
                      aria-label="Kalemi sil"
                      className="px-2 text-xl text-mercan"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    inputMode="decimal"
                    value={k.miktar}
                    onChange={(e) => kalemGuncelle(i, "miktar", e.target.value)}
                    aria-label="Miktar"
                    className={`${alan} w-20`}
                  />
                  <select
                    value={k.birim}
                    onChange={(e) => kalemGuncelle(i, "birim", e.target.value)}
                    aria-label="Birim"
                    className={`${alan} w-24 bg-white`}
                  >
                    {BIRIMLER.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <input
                    inputMode="decimal"
                    value={k.fiyat}
                    onChange={(e) => kalemGuncelle(i, "fiyat", e.target.value)}
                    placeholder="Birim fiyat"
                    aria-label="Birim fiyat"
                    className={`${alan} flex-1`}
                  />
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setKalemler((o) => [...o, bosKalem()])}
            className="mt-2 text-sm font-semibold text-turkuaz"
          >
            + Ürün ekle
          </button>
          {kalemToplami > 0 && (
            <p className="mt-1 text-xs text-navy/50">Kalem toplamı: {para(kalemToplami)}</p>
          )}
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-navy/70">Fiş fotoğrafı (isteğe bağlı)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-navy/70">Not (isteğe bağlı)</span>
          <textarea
            value={notMetni}
            onChange={(e) => setNotMetni(e.target.value)}
            rows={2}
            className={alan}
          />
        </label>

        {hata && <p className="mb-3 text-sm font-medium text-mercan">{hata}</p>}

        <div className="flex gap-3 pb-1">
          <button
            type="button"
            onClick={onKapat}
            className="flex-1 rounded-lg py-3 font-semibold text-navy/70 active:bg-navy/5"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={kaydediliyor}
            className="flex-1 rounded-lg bg-turkuaz py-3 font-semibold text-white disabled:opacity-60"
          >
            {kaydediliyor ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
