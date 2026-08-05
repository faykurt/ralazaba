interface Props {
  mesaj: string;
  onOnayla: () => void;
  onVazgec: () => void;
}

export default function ConfirmDialog({ mesaj, onOnayla, onVazgec }: Props) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-navy/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <p className="mb-6 text-navy">{mesaj}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onVazgec}
            className="rounded-lg px-4 py-3 font-semibold text-navy/70 active:bg-navy/5"
          >
            Vazgeç
          </button>
          <button
            onClick={onOnayla}
            className="rounded-lg bg-mercan px-4 py-3 font-semibold text-white active:opacity-90"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}
