"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import type { TatilNotu } from "@/lib/adminTypes";
import { tarihYaz } from "@/lib/tatilOzet";

interface Props {
  tatilId: string;
  notlar: TatilNotu[];
  onDegisti: () => void;
}

export default function NotPaneli({ tatilId, notlar, onDegisti }: Props) {
  const [metin, setMetin] = useState("");
  const [tarih, setTarih] = useState(() => new Date().toISOString().slice(0, 10));
  const [hata, setHata] = useState<string | null>(null);

  async function ekle(e: FormEvent) {
    e.preventDefault();
    if (!metin.trim()) return;
    const { error } = await supabase
      .from("tatil_notlari")
      .insert({ tatil_id: tatilId, tarih, metin: metin.trim() });
    if (error) return setHata(error.message);
    setHata(null);
    setMetin("");
    onDegisti();
  }

  async function sil(n: TatilNotu) {
    if (!window.confirm("Bu notu silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("tatil_notlari").delete().eq("id", n.id);
    if (error) return setHata(error.message);
    onDegisti();
  }

  return (
    <div>
      <form onSubmit={ekle} className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <input
          type="date"
          value={tarih}
          onChange={(e) => setTarih(e.target.value)}
          className="mb-3 rounded-lg border border-navy/20 px-3 py-2.5"
        />
        <textarea
          value={metin}
          onChange={(e) => setMetin(e.target.value)}
          rows={3}
          placeholder="Tatil notu: ne oldu, neler eksik kaldı, neler fazla geldi..."
          className="mb-3 w-full rounded-lg border border-navy/20 px-4 py-3"
        />
        {hata && <p className="mb-3 text-sm text-mercan">{hata}</p>}
        <button
          type="submit"
          disabled={!metin.trim()}
          className="w-full rounded-lg bg-turkuaz py-3 font-semibold text-white disabled:opacity-60"
        >
          Not Ekle
        </button>
      </form>

      {notlar.length === 0 ? (
        <p className="py-8 text-center text-navy/50">Henüz not yok.</p>
      ) : (
        <ul className="space-y-3">
          {notlar.map((n) => (
            <li key={n.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="mb-1 text-sm font-semibold text-turkuaz">{tarihYaz(n.tarih)}</p>
              <p className="whitespace-pre-wrap">{n.metin}</p>
              <button onClick={() => sil(n)} className="mt-2 text-sm font-semibold text-mercan">
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
