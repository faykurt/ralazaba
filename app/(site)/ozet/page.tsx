"use client";

import { useHarcamalar } from "@/lib/useHarcamalar";
import { hesaplaOzet, hesaplaTransferler } from "@/lib/settlement";
import { ozetCsvIndir } from "@/lib/csv";

export default function OzetSayfasi() {
  const { harcamalar, loading, error } = useHarcamalar();
  const ozet = hesaplaOzet(harcamalar);
  const transferler = hesaplaTransferler(ozet);

  if (loading) {
    return <p className="py-12 text-center text-navy/50">Yükleniyor...</p>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <p className="rounded-lg bg-mercan/10 p-3 text-sm text-mercan">
          Bağlantı hatası: {error}
        </p>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-navy">Kişi Bazlı Özet</h1>
          <button
            onClick={() => ozetCsvIndir(ozet)}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-kum active:opacity-90"
          >
            CSV indir
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-navy/10 text-left text-navy/50">
                <th className="px-4 py-3 font-medium">Kişi</th>
                <th className="px-4 py-3 text-right font-medium">Ödediği</th>
                <th className="px-4 py-3 text-right font-medium">Payı</th>
                <th className="px-4 py-3 text-right font-medium">Net</th>
              </tr>
            </thead>
            <tbody>
              {ozet.map((o) => (
                <tr key={o.kisi} className="border-b border-navy/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-navy">{o.kisi}</td>
                  <td className="px-4 py-3 text-right text-navy/70">
                    {Math.round(o.odedi).toLocaleString("tr-TR")} TL
                  </td>
                  <td className="px-4 py-3 text-right text-navy/70">
                    {Math.round(o.payi).toLocaleString("tr-TR")} TL
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      o.net >= 0 ? "text-turkuaz" : "text-mercan"
                    }`}
                  >
                    {o.net >= 0 ? "+" : ""}
                    {Math.round(o.net).toLocaleString("tr-TR")} TL
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-navy">
          Kim Kime Ne Kadar Ödeyecek
        </h2>
        {transferler.length === 0 ? (
          <p className="text-navy/50">
            Herkes ödeşmiş durumda, bakiyeler dengede.
          </p>
        ) : (
          <ul className="space-y-2">
            {transferler.map((t, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
              >
                <span className="text-navy">
                  <strong>{t.kimden}</strong> → <strong>{t.kime}</strong>
                </span>
                <span className="font-bold text-turkuaz">
                  {t.tutar.toLocaleString("tr-TR")} TL
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
