"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Fis, KalanUrun, Tatil, TatilNotu, Yukleme } from "@/lib/adminTypes";
import YuklemePaneli from "@/components/admin/YuklemePaneli";
import FisPaneli from "@/components/admin/FisPaneli";
import NotPaneli from "@/components/admin/NotPaneli";
import OzetPaneli from "@/components/admin/OzetPaneli";

const SEKMELER = [
  { id: "belgeler", etiket: "Belgeler" },
  { id: "fisler", etiket: "Fişler" },
  { id: "notlar", etiket: "Notlar" },
  { id: "ozet", etiket: "Özet" },
] as const;

type SekmeId = (typeof SEKMELER)[number]["id"];

export default function TatilSayfasi() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sekme, setSekme] = useState<SekmeId>("belgeler");
  const [tatil, setTatil] = useState<Tatil | null>(null);
  const [yuklemeler, setYuklemeler] = useState<Yukleme[]>([]);
  const [fisler, setFisler] = useState<Fis[]>([]);
  const [notlar, setNotlar] = useState<TatilNotu[]>([]);
  const [kalanlar, setKalanlar] = useState<KalanUrun[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  const yukle = useCallback(async () => {
    const [t, f, n, k, y] = await Promise.all([
      supabase.from("tatiller").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("fisler")
        .select("*, fis_kalemleri(*)")
        .eq("tatil_id", id)
        .order("tarih", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("tatil_notlari")
        .select("*")
        .eq("tatil_id", id)
        .order("tarih", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("kalan_urunler").select("*").eq("tatil_id", id).order("urun"),
      supabase
        .from("yuklemeler")
        .select("*")
        .eq("tatil_id", id)
        .order("created_at", { ascending: false }),
    ]);
    const ilkHata = t.error ?? f.error ?? n.error ?? k.error ?? y.error;
    if (ilkHata) {
      setHata(ilkHata.message);
    } else {
      setHata(null);
      setTatil(t.data as Tatil | null);
      setFisler(f.data as Fis[]);
      setNotlar(n.data as TatilNotu[]);
      setKalanlar(k.data as KalanUrun[]);
      setYuklemeler(y.data as Yukleme[]);
    }
    setYukleniyor(false);
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void yukle();
  }, [yukle]);

  async function tatilSil() {
    if (!tatil) return;
    if (
      !window.confirm(
        `"${tatil.ad}" tatilini; tüm fişleri, notları ve kayıtlarıyla birlikte silmek istediğinize emin misiniz? Bu geri alınamaz.`,
      )
    )
      return;
    const yollar = [
      ...fisler.map((f) => f.foto_yolu).filter((y): y is string => !!y),
      ...yuklemeler.map((y) => y.dosya_yolu),
    ];
    const { error } = await supabase.from("tatiller").delete().eq("id", tatil.id);
    if (error) return setHata(error.message);
    if (yollar.length) await supabase.storage.from("fisler").remove(yollar);
    router.push("/admin");
  }

  if (yukleniyor) return <p className="py-12 text-center text-navy/50">Yükleniyor...</p>;
  if (hata)
    return <p className="rounded-lg bg-mercan/10 p-3 text-sm text-mercan">Hata: {hata}</p>;
  if (!tatil) return <p className="py-12 text-center text-navy/50">Tatil bulunamadı.</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3 print:hidden">
        <Link href="/admin" className="text-sm font-semibold text-turkuaz">
          ← Tatiller
        </Link>
        <button onClick={tatilSil} className="text-sm font-semibold text-mercan">
          Tatili sil
        </button>
      </div>

      <h1 className="mb-4 text-2xl font-bold print:hidden">{tatil.ad}</h1>

      <nav className="mb-4 flex gap-2 print:hidden">
        {SEKMELER.map((s) => (
          <button
            key={s.id}
            onClick={() => setSekme(s.id)}
            className={`flex-1 rounded-full border-b-[3px] py-2.5 text-sm font-semibold ${
              sekme === s.id
                ? "border-turkuaz bg-white text-navy"
                : "border-transparent bg-white/50 text-navy/60"
            }`}
          >
            {s.etiket}
          </button>
        ))}
      </nav>

      {sekme === "belgeler" && (
        <YuklemePaneli tatilId={tatil.id} yuklemeler={yuklemeler} onDegisti={yukle} />
      )}
      {sekme === "fisler" && <FisPaneli tatilId={tatil.id} fisler={fisler} onDegisti={yukle} />}
      {sekme === "notlar" && <NotPaneli tatilId={tatil.id} notlar={notlar} onDegisti={yukle} />}
      {sekme === "ozet" && (
        <OzetPaneli
          tatil={tatil}
          fisler={fisler}
          notlar={notlar}
          kalanlar={kalanlar}
          onDegisti={yukle}
        />
      )}
    </div>
  );
}
