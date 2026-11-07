import type { Fis, KalanUrun, Tatil, TatilNotu } from "./adminTypes";

export interface UrunSatiri {
  anahtar: string;
  urun: string;
  birim: string;
  alinan: number;
  kalan: number;
  tuketilen: number;
  harcanan: number;
}

export interface MarketSatiri {
  market: string;
  fisSayisi: number;
  toplam: number;
}

export interface TatilOzeti {
  toplam: number;
  fisSayisi: number;
  marketler: MarketSatiri[];
  urunler: UrunSatiri[];
}

const anahtarOlustur = (urun: string, birim: string) =>
  `${urun.trim().toLocaleLowerCase("tr")}|${birim}`;

export function tatilOzetiHesapla(
  fisler: Fis[],
  kalanlar: KalanUrun[],
): TatilOzeti {
  const marketMap = new Map<string, MarketSatiri>();
  const urunMap = new Map<string, UrunSatiri>();

  for (const fis of fisler) {
    const mAnahtar = fis.market.trim().toLocaleLowerCase("tr");
    const m = marketMap.get(mAnahtar) ?? {
      market: fis.market.trim(),
      fisSayisi: 0,
      toplam: 0,
    };
    m.fisSayisi += 1;
    m.toplam += Number(fis.toplam);
    marketMap.set(mAnahtar, m);

    for (const k of fis.fis_kalemleri) {
      const anahtar = anahtarOlustur(k.urun, k.birim);
      const u = urunMap.get(anahtar) ?? {
        anahtar,
        urun: k.urun.trim(),
        birim: k.birim,
        alinan: 0,
        kalan: 0,
        tuketilen: 0,
        harcanan: 0,
      };
      u.alinan += Number(k.miktar);
      u.harcanan += Number(k.fiyat ?? 0) * Number(k.miktar);
      urunMap.set(anahtar, u);
    }
  }

  for (const k of kalanlar) {
    const anahtar = anahtarOlustur(k.urun, k.birim);
    const u = urunMap.get(anahtar) ?? {
      anahtar,
      urun: k.urun.trim(),
      birim: k.birim,
      alinan: 0,
      kalan: 0,
      tuketilen: 0,
      harcanan: 0,
    };
    u.kalan += Number(k.miktar);
    urunMap.set(anahtar, u);
  }

  const urunler = [...urunMap.values()]
    .map((u) => ({ ...u, tuketilen: Math.max(u.alinan - u.kalan, 0) }))
    .sort((a, b) => a.urun.localeCompare(b.urun, "tr"));

  return {
    toplam: fisler.reduce((t, f) => t + Number(f.toplam), 0),
    fisSayisi: fisler.length,
    marketler: [...marketMap.values()].sort((a, b) => b.toplam - a.toplam),
    urunler,
  };
}

export const para = (n: number) =>
  `${n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`;

export const sayi = (n: number) =>
  n.toLocaleString("tr-TR", { maximumFractionDigits: 3 });

export const tarihYaz = (t: string | null) =>
  t ? new Date(`${t}T00:00:00`).toLocaleDateString("tr-TR") : "—";

export function markdownRapor(
  tatil: Tatil,
  ozet: TatilOzeti,
  fisler: Fis[],
  notlar: TatilNotu[],
): string {
  const s: string[] = [];
  s.push(`# ${tatil.ad}`);
  s.push(`${tarihYaz(tatil.baslangic)} – ${tarihYaz(tatil.bitis)}`);
  if (tatil.aciklama) s.push(`\n${tatil.aciklama}`);
  s.push(`\n## Genel\n- Toplam harcama: ${para(ozet.toplam)}\n- Fiş sayısı: ${ozet.fisSayisi}`);

  s.push(`\n## Marketler`);
  for (const m of ozet.marketler)
    s.push(`- ${m.market}: ${para(m.toplam)} (${m.fisSayisi} fiş)`);

  s.push(`\n## Ürünler (alınan / kalan / tüketilen)`);
  for (const u of ozet.urunler)
    s.push(
      `- ${u.urun}: alınan ${sayi(u.alinan)} ${u.birim}, kalan ${sayi(u.kalan)} ${u.birim}, tüketilen ${sayi(u.tuketilen)} ${u.birim}`,
    );

  s.push(`\n## Fişler`);
  for (const f of fisler) {
    s.push(`\n### ${tarihYaz(f.tarih)} – ${f.market} – ${para(Number(f.toplam))}`);
    for (const k of f.fis_kalemleri)
      s.push(`- ${k.urun}: ${sayi(Number(k.miktar))} ${k.birim}${k.fiyat != null ? ` × ${para(Number(k.fiyat))}` : ""}`);
    if (f.not_metni) s.push(`> ${f.not_metni}`);
  }

  s.push(`\n## Notlar`);
  for (const n of notlar) s.push(`- ${tarihYaz(n.tarih)}: ${n.metin}`);

  return s.join("\n") + "\n";
}
