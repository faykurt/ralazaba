import type { Harcama } from "@/lib/types";

interface Props {
  harcama: Harcama;
  onDuzenle: () => void;
  onSil: () => void;
}

export default function ExpenseCard({ harcama, onDuzenle, onSil }: Props) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-navy">{harcama.aciklama}</p>
        <p className="text-sm text-navy/60">
          {harcama.odeyen} ödedi · {harcama.dahil_olanlar.length} kişi
        </p>
      </div>
      <span className="shrink-0 text-lg font-bold text-turkuaz">
        {harcama.tutar.toLocaleString("tr-TR")} TL
      </span>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onDuzenle}
          aria-label="Düzenle"
          className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-navy/50 active:bg-navy/5"
        >
          ✏️
        </button>
        <button
          onClick={onSil}
          aria-label="Sil"
          className="flex h-11 w-11 items-center justify-center rounded-full text-lg text-navy/50 active:bg-mercan/10"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
