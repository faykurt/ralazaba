"use client";

import { useState } from "react";
import { useHarcamalar } from "@/lib/useHarcamalar";
import ExpenseCard from "@/components/ExpenseCard";
import ExpenseFormModal from "@/components/ExpenseFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import TotalBanner from "@/components/TotalBanner";
import { AnchorIcon } from "@/components/icons";
import type { Harcama, HarcamaGirdi } from "@/lib/types";

export default function AnaSayfa() {
  const { harcamalar, loading, error, ekle, guncelle, sil } = useHarcamalar();
  const [formAcik, setFormAcik] = useState(false);
  const [duzenlenen, setDuzenlenen] = useState<Harcama | null>(null);
  const [silinecek, setSilinecek] = useState<Harcama | null>(null);

  const toplam = harcamalar.reduce((acc, h) => acc + h.tutar, 0);

  function yeniEkle() {
    setDuzenlenen(null);
    setFormAcik(true);
  }

  function duzenle(h: Harcama) {
    setDuzenlenen(h);
    setFormAcik(true);
  }

  async function kaydet(girdi: HarcamaGirdi) {
    if (duzenlenen) {
      await guncelle(duzenlenen.id, girdi);
    } else {
      await ekle(girdi);
    }
    setFormAcik(false);
    setDuzenlenen(null);
  }

  async function onaylaSil() {
    if (!silinecek) return;
    await sil(silinecek.id);
    setSilinecek(null);
  }

  return (
    <div>
      <TotalBanner toplam={toplam} />

      {error && (
        <p className="mb-4 rounded-lg bg-mercan/10 p-3 text-sm text-mercan">
          Bağlantı hatası: {error}
        </p>
      )}

      {loading ? (
        <p className="py-12 text-center text-navy/50">Yükleniyor...</p>
      ) : harcamalar.length === 0 ? (
        <p className="py-12 text-center text-navy/50">
          Henüz harcama eklenmedi. Sağ alttaki + butonuyla ekleyebilirsin.
        </p>
      ) : (
        <ul className="space-y-3">
          {harcamalar.map((h, i) => (
            <ExpenseCard
              key={h.id}
              harcama={h}
              index={i}
              onDuzenle={() => duzenle(h)}
              onSil={() => setSilinecek(h)}
            />
          ))}
        </ul>
      )}

      <button
        onClick={yeniEkle}
        aria-label="Harcama ekle"
        className="fixed right-6 bottom-6 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-turkuaz text-white shadow-lg active:scale-95"
      >
        <AnchorIcon className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-mercan text-base leading-none font-bold text-white ring-2 ring-kum">
          +
        </span>
      </button>

      {formAcik && (
        <ExpenseFormModal
          harcama={duzenlenen}
          onKaydet={kaydet}
          onKapat={() => {
            setFormAcik(false);
            setDuzenlenen(null);
          }}
        />
      )}

      {silinecek && (
        <ConfirmDialog
          mesaj={`"${silinecek.aciklama}" harcamasını silmek istediğinize emin misiniz?`}
          onOnayla={onaylaSil}
          onVazgec={() => setSilinecek(null)}
        />
      )}
    </div>
  );
}
