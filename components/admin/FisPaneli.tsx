"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Fis } from "@/lib/adminTypes";
import { para, sayi, tarihYaz } from "@/lib/tatilOzet";
import FisFormu from "./FisFormu";

interface Props {
  tatilId: string;
  fisler: Fis[];
  onDegisti: () => void;
}

export default function FisPaneli({ tatilId, fisler, onDegisti }: Props) {
  const [formAcik, setFormAcik] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [foto, setFoto] = useState<{ id: string; url: string } | null>(null);

  async function fotoGoster(fis: Fis) {
    if (!fis.foto_yolu) return;
    const { data, error } = await supabase.storage
      .from("fisler")
      .createSignedUrl(fis.foto_yolu, 300);
    if (error) return setHata(error.message);
    setFoto({ id: fis.id, url: data.signedUrl });
  }

  async function sil(fis: Fis) {
    if (!window.confirm(`"${fis.market}" fişini silmek istediğinize emin misiniz?`)) return;
    const { error } = await supabase.from("fisler").delete().eq("id", fis.id);
    if (error) return setHata(error.message);
    if (fis.foto_yolu) await supabase.storage.from("fisler").remove([fis.foto_yolu]);
    onDegisti();
  }

  return (
    <div>
      {hata && <p className="mb-3 rounded-lg bg-mercan/10 p-3 text-sm text-mercan">{hata}</p>}
      <button
        onClick={() => setFormAcik(true)}
        className="mb-4 w-full rounded-lg bg-white py-3 font-semibold text-navy shadow-sm"
      >
        + Elle fiş ekle
      </button>

      {fisler.length === 0 ? (
        <p className="py-8 text-center text-navy/50">Henüz fiş yok.</p>
      ) : (
        <ul className="space-y-3">
          {fisler.map((f) => (
            <li key={f.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-bold">{f.market}</span>
                <span className="font-semibold text-turkuaz">{para(Number(f.toplam))}</span>
              </div>
              <p className="text-sm text-navy/60">{tarihYaz(f.tarih)}</p>
              {f.fis_kalemleri.length > 0 && (
                <ul className="mt-2 space-y-0.5 text-sm">
                  {f.fis_kalemleri.map((k) => (
                    <li key={k.id} className="flex justify-between gap-3">
                      <span>{k.urun}</span>
                      <span className="text-navy/60">
                        {sayi(Number(k.miktar))} {k.birim}
                        {k.fiyat != null && ` × ${para(Number(k.fiyat))}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {f.not_metni && (
                <p className="mt-2 rounded-lg bg-kum p-2 text-sm text-navy/80">{f.not_metni}</p>
              )}
              <div className="mt-3 flex gap-4 text-sm font-semibold">
                {f.foto_yolu && (
                  <button onClick={() => fotoGoster(f)} className="text-turkuaz">
                    Fotoğrafı gör
                  </button>
                )}
                <button onClick={() => sil(f)} className="text-mercan">
                  Sil
                </button>
              </div>
              {foto?.id === f.id && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={foto.url} alt="Fiş fotoğrafı" className="mt-3 max-h-96 w-full rounded-lg object-contain" />
              )}
            </li>
          ))}
        </ul>
      )}

      {formAcik && (
        <FisFormu
          tatilId={tatilId}
          onKapat={() => setFormAcik(false)}
          onKaydedildi={() => {
            setFormAcik(false);
            onDegisti();
          }}
        />
      )}
    </div>
  );
}
