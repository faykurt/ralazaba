"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Yukleme, YuklemeTuru } from "@/lib/adminTypes";

interface Props {
  tatilId: string;
  yuklemeler: Yukleme[];
  onDegisti: () => void;
}

const DOSYA_LIMIT = 10 * 1024 * 1024;
const TURLER: { id: YuklemeTuru; etiket: string }[] = [
  { id: "fis", etiket: "Fiş" },
  { id: "not", etiket: "Not / screenshot" },
  { id: "diger", etiket: "Diğer" },
];

const pdfMi = (y: Yukleme) => y.dosya_yolu.toLowerCase().endsWith(".pdf");

export default function YuklemePaneli({ tatilId, yuklemeler, onDegisti }: Props) {
  const girdi = useRef<HTMLInputElement>(null);
  const [tur, setTur] = useState<YuklemeTuru>("fis");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [onizleme, setOnizleme] = useState<Record<string, string>>({});
  const [buyuk, setBuyuk] = useState<string | null>(null);

  const yollarAnahtari = yuklemeler.map((y) => y.dosya_yolu).join("|");

  useEffect(() => {
    const yollar = yuklemeler.filter((y) => !pdfMi(y)).map((y) => y.dosya_yolu);
    if (yollar.length === 0) return;
    let aktif = true;
    supabase.storage
      .from("fisler")
      .createSignedUrls(yollar, 3600)
      .then(({ data }) => {
        if (!aktif || !data) return;
        const harita: Record<string, string> = {};
        for (const d of data) if (d.path && d.signedUrl) harita[d.path] = d.signedUrl;
        setOnizleme(harita);
      });
    return () => {
      aktif = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yollarAnahtari]);

  async function yukle(dosyalar: FileList | null) {
    if (!dosyalar || dosyalar.length === 0) return;
    setHata(null);
    setMesaj(null);
    setYukleniyor(true);
    let basarili = 0;
    const hatalar: string[] = [];

    for (const dosya of Array.from(dosyalar)) {
      if (dosya.size > DOSYA_LIMIT) {
        hatalar.push(`${dosya.name}: 10 MB'tan büyük`);
        continue;
      }
      if (!dosya.type.startsWith("image/") && dosya.type !== "application/pdf") {
        hatalar.push(`${dosya.name}: yalnızca fotoğraf veya PDF`);
        continue;
      }
      const uzanti = (dosya.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const yol = `${tatilId}/yuklemeler/${crypto.randomUUID()}.${uzanti || "jpg"}`;
      const { error: yuklemeHatasi } = await supabase.storage
        .from("fisler")
        .upload(yol, dosya, { contentType: dosya.type });
      if (yuklemeHatasi) {
        hatalar.push(`${dosya.name}: ${yuklemeHatasi.message}`);
        continue;
      }
      const { error: kayitHatasi } = await supabase.from("yuklemeler").insert({
        tatil_id: tatilId,
        dosya_yolu: yol,
        dosya_adi: dosya.name,
        tur,
      });
      if (kayitHatasi) {
        await supabase.storage.from("fisler").remove([yol]);
        hatalar.push(`${dosya.name}: ${kayitHatasi.message}`);
        continue;
      }
      basarili += 1;
    }

    setYukleniyor(false);
    if (girdi.current) girdi.current.value = "";
    if (basarili > 0) setMesaj(`${basarili} dosya yüklendi.`);
    if (hatalar.length > 0) setHata(hatalar.join(" · "));
    onDegisti();
  }

  async function sil(y: Yukleme) {
    if (!window.confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("yuklemeler").delete().eq("id", y.id);
    if (error) return setHata(error.message);
    await supabase.storage.from("fisler").remove([y.dosya_yolu]);
    onDegisti();
  }

  async function islendiDegistir(y: Yukleme) {
    const { error } = await supabase
      .from("yuklemeler")
      .update({ islendi: !y.islendi })
      .eq("id", y.id);
    if (error) return setHata(error.message);
    onDegisti();
  }

  const bekleyen = yuklemeler.filter((y) => !y.islendi).length;

  return (
    <div>
      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap gap-2">
          {TURLER.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTur(t.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                tur === t.id ? "bg-turkuaz text-white" : "bg-navy/10 text-navy/60"
              }`}
            >
              {t.etiket}
            </button>
          ))}
        </div>
        <input
          ref={girdi}
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => yukle(e.target.files)}
        />
        <button
          type="button"
          disabled={yukleniyor}
          onClick={() => girdi.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-turkuaz/60 bg-kum py-8 text-center font-semibold text-navy disabled:opacity-60"
        >
          {yukleniyor ? "Yükleniyor..." : "Fotoğraf / screenshot / PDF seç"}
          <span className="mt-1 block text-sm font-normal text-navy/60">
            Birden fazla dosya seçebilirsin (en fazla 10 MB)
          </span>
        </button>
        {mesaj && <p className="mt-3 text-sm font-medium text-turkuaz">{mesaj}</p>}
        {hata && <p className="mt-3 text-sm text-mercan">{hata}</p>}
      </div>

      {yuklemeler.length > 0 && (
        <p className="mb-3 text-sm text-navy/60">
          {yuklemeler.length} dosya · {bekleyen} işlenmeyi bekliyor
        </p>
      )}

      {yuklemeler.length === 0 ? (
        <p className="py-8 text-center text-navy/50">Henüz dosya yüklenmedi.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {yuklemeler.map((y) => (
            <li key={y.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {pdfMi(y) ? (
                <div className="flex h-32 items-center justify-center bg-kum text-lg font-bold text-navy/50">
                  PDF
                </div>
              ) : onizleme[y.dosya_yolu] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={onizleme[y.dosya_yolu]}
                  alt={y.dosya_adi ?? "Yükleme"}
                  onClick={() => setBuyuk(onizleme[y.dosya_yolu])}
                  className="h-32 w-full cursor-zoom-in object-cover"
                />
              ) : (
                <div className="h-32 bg-kum" />
              )}
              <div className="p-2 text-xs">
                <div className="mb-1 flex items-center justify-between gap-1">
                  <span className="text-navy/60">
                    {TURLER.find((t) => t.id === y.tur)?.etiket}
                  </span>
                  <button
                    onClick={() => islendiDegistir(y)}
                    className={`rounded-full px-2 py-0.5 font-semibold ${
                      y.islendi ? "bg-turkuaz/15 text-turkuaz" : "bg-mercan/15 text-mercan"
                    }`}
                  >
                    {y.islendi ? "İşlendi" : "Bekliyor"}
                  </button>
                </div>
                <button onClick={() => sil(y)} className="font-semibold text-mercan">
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {buyuk && (
        <div
          onClick={() => setBuyuk(null)}
          className="fixed inset-0 z-40 flex items-center justify-center bg-navy/80 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={buyuk} alt="Büyük önizleme" className="max-h-full max-w-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
