import { getCardDecor } from "@/lib/cardDecor";
import type { Harcama } from "@/lib/types";
import { PencilIcon, TrashIcon } from "./icons";

interface Props {
  harcama: Harcama;
  index: number;
  onDuzenle: () => void;
  onSil: () => void;
}

export default function ExpenseCard({ harcama, index, onDuzenle, onSil }: Props) {
  const { Avatar, Aksan } = getCardDecor(index);

  return (
    <li className="relative flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <Aksan className="absolute top-3 right-3 h-5 w-5 text-navy/10" />

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-turkuaz-light/30 text-turkuaz">
        <Avatar className="h-7 w-7" />
      </div>

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
          className="flex h-10 w-10 items-center justify-center rounded-full bg-kum text-navy/60 active:bg-navy/10"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onSil}
          aria-label="Sil"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-kum text-navy/60 active:bg-mercan/10"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
