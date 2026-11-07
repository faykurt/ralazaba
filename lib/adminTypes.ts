export interface Tatil {
  id: string;
  ad: string;
  baslangic: string | null;
  bitis: string | null;
  aciklama: string | null;
  created_at: string;
}

export interface FisKalemi {
  id: string;
  fis_id: string;
  urun: string;
  miktar: number;
  birim: string;
  fiyat: number | null;
}

export interface Fis {
  id: string;
  tatil_id: string;
  market: string;
  tarih: string;
  toplam: number;
  foto_yolu: string | null;
  not_metni: string | null;
  created_at: string;
  fis_kalemleri: FisKalemi[];
}

export interface TatilNotu {
  id: string;
  tatil_id: string;
  tarih: string;
  metin: string;
  created_at: string;
}

export interface KalanUrun {
  id: string;
  tatil_id: string;
  urun: string;
  miktar: number;
  birim: string;
}

export type YuklemeTuru = "fis" | "not" | "diger";

export interface Yukleme {
  id: string;
  tatil_id: string;
  dosya_yolu: string;
  dosya_adi: string | null;
  tur: YuklemeTuru;
  aciklama: string | null;
  islendi: boolean;
  created_at: string;
}

export const BIRIMLER = ["adet", "kg", "gr", "lt", "paket", "kutu", "şişe"] as const;
