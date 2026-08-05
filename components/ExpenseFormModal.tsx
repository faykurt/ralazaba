"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { KATILIMCILAR } from "@/lib/participants";
import type { Harcama, HarcamaGirdi } from "@/lib/types";

interface Props {
  harcama: Harcama | null;
  onKaydet: (girdi: HarcamaGirdi) => Promise<void>;
  onKapat: () => void;
}

export default function ExpenseFormModal({ harcama, onKaydet, onKapat }: Props) {
  const [tutar, setTutar] = useState(harcama ? String(harcama.tutar) : "");
  const [aciklama, setAciklama] = useState(harcama?.aciklama ?? "");
  const [odeyen, setOdeyen] = useState(harcama?.odeyen ?? "");
  const [dahilOlanlar, setDahilOlanlar] = useState<string[]>(
    harcama?.dahil_olanlar ?? [...KATILIMCILAR],
  );
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  function handleTutarChange(e: ChangeEvent<HTMLInputElement>) {
    setTutar(e.target.value.replace(/[^0-9]/g, ""));
  }

  function toggleKisi(kisi: string) {
    setDahilOlanlar((prev) =>
      prev.includes(kisi) ? prev.filter((k) => k !== kisi) : [...prev, kisi],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setHata(null);

    const tutarSayi = parseInt(tutar, 10);
    if (!tutar || !Number.isInteger(tutarSayi) || tutarSayi <= 0) {
      setHata("Geçerli bir tutar girin.");
      return;
    }
    if (!aciklama.trim()) {
      setHata("Açıklama girin.");
      return;
    }
    if (!odeyen) {
      setHata("Kim ödedi seçin.");
      return;
    }
    if (dahilOlanlar.length === 0) {
      setHata("En az 1 kişi seçili olmalı.");
      return;
    }

    setKaydediliyor(true);
    try {
      await onKaydet({
        tutar: tutarSayi,
        aciklama: aciklama.trim(),
        odeyen,
        dahil_olanlar: dahilOlanlar,
      });
    } catch {
      setHata("Kaydedilemedi, tekrar deneyin.");
      setKaydediliyor(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-navy/50 sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
      >
        <h2 className="mb-4 text-xl font-bold text-navy">
          {harcama ? "Harcamayı Düzenle" : "Yeni Harcama"}
        </h2>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-navy/70">
            Tutar (TL)
          </span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={tutar}
            onChange={handleTutarChange}
            placeholder="0"
            className="w-full rounded-lg border border-navy/20 px-4 py-3 text-lg"
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium text-navy/70">
            Açıklama
          </span>
          <input
            type="text"
            value={aciklama}
            onChange={(e) => setAciklama(e.target.value)}
            placeholder="Örn: Market alışverişi"
            className="w-full rounded-lg border border-navy/20 px-4 py-3"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium text-navy/70">
            Kim ödedi
          </span>
          <select
            value={odeyen}
            onChange={(e) => setOdeyen(e.target.value)}
            className="w-full rounded-lg border border-navy/20 bg-white px-4 py-3"
          >
            <option value="">Seçiniz</option>
            {KATILIMCILAR.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>

        <div className="mb-4">
          <span className="mb-2 block text-sm font-medium text-navy/70">
            Kimler dahildi
          </span>
          <div className="flex flex-wrap gap-2">
            {KATILIMCILAR.map((k) => {
              const secili = dahilOlanlar.includes(k);
              return (
                <button
                  type="button"
                  key={k}
                  onClick={() => toggleKisi(k)}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    secili
                      ? "bg-turkuaz text-white"
                      : "bg-navy/10 text-navy/50"
                  }`}
                >
                  {k}
                </button>
              );
            })}
          </div>
        </div>

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
