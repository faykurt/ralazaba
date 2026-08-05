"use client";

import { useState } from "react";
import { useHarcamalar } from "@/lib/useHarcamalar";
import ExpenseCard from "@/components/ExpenseCard";
import ExpenseFormModal from "@/components/ExpenseFormModal";
import ConfirmDialog from "@/components/ConfirmDialog";
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
      <div className="sticky top-0 z-10 -mx-4 mb-4 bg-navy px-4 py-4 text-kum shadow-md sm:mx-0 sm:rounded-b-2xl">
        <p className="text-sm text-kum/70">Toplam Harcama</p>
        <p className="text-3xl font-bold">{toplam.toLocaleString("tr-TR")} TL</p>
      </div>

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
          {harcamalar.map((h) => (
            <ExpenseCard
              key={h.id}
              harcama={h}
              onDuzenle={() => duzenle(h)}
              onSil={() => setSilinecek(h)}
            />
          ))}
        </ul>
      )}

      <button
        onClick={yeniEkle}
        aria-label="Harcama ekle"
        className="fixed right-6 bottom-6 flex h-16 w-16 items-center justify-center rounded-full bg-mercan text-3xl leading-none text-white shadow-lg active:scale-95"
      >
        +
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
