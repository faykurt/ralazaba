import { KATILIMCILAR } from "./participants";
import type { Harcama } from "./types";

export interface KisiOzet {
  kisi: string;
  odedi: number;
  payi: number;
  net: number;
}

export interface Transfer {
  kimden: string;
  kime: string;
  tutar: number;
}

export function hesaplaOzet(harcamalar: Harcama[]): KisiOzet[] {
  const odedigi = new Map<string, number>();
  const payi = new Map<string, number>();
  for (const kisi of KATILIMCILAR) {
    odedigi.set(kisi, 0);
    payi.set(kisi, 0);
  }

  for (const h of harcamalar) {
    odedigi.set(h.odeyen, (odedigi.get(h.odeyen) ?? 0) + h.tutar);
    const kisiSayisi = h.dahil_olanlar.length;
    if (kisiSayisi === 0) continue;
    const kisiBasiPay = h.tutar / kisiSayisi;
    for (const kisi of h.dahil_olanlar) {
      payi.set(kisi, (payi.get(kisi) ?? 0) + kisiBasiPay);
    }
  }

  return KATILIMCILAR.map((kisi) => {
    const odenen = odedigi.get(kisi) ?? 0;
    const pay = payi.get(kisi) ?? 0;
    return { kisi, odedi: odenen, payi: pay, net: odenen - pay };
  });
}

// Greedy borç netleştirme: en büyük borçlu ile en büyük alacaklıyı eşleştirir.
export function hesaplaTransferler(ozet: KisiOzet[]): Transfer[] {
  const esikDeger = 0.5;

  const alacaklilar = ozet
    .filter((o) => o.net > esikDeger)
    .map((o) => ({ kisi: o.kisi, tutar: o.net }))
    .sort((a, b) => b.tutar - a.tutar);

  const borclular = ozet
    .filter((o) => o.net < -esikDeger)
    .map((o) => ({ kisi: o.kisi, tutar: -o.net }))
    .sort((a, b) => b.tutar - a.tutar);

  const transferler: Transfer[] = [];
  let i = 0;
  let j = 0;

  while (i < borclular.length && j < alacaklilar.length) {
    const borclu = borclular[i];
    const alacakli = alacaklilar[j];
    const tutar = Math.min(borclu.tutar, alacakli.tutar);

    if (tutar > esikDeger) {
      transferler.push({
        kimden: borclu.kisi,
        kime: alacakli.kisi,
        tutar: Math.round(tutar),
      });
    }

    borclu.tutar -= tutar;
    alacakli.tutar -= tutar;

    if (borclu.tutar <= esikDeger) i++;
    if (alacakli.tutar <= esikDeger) j++;
  }

  return transferler;
}
