export interface Harcama {
  id: string;
  tutar: number;
  aciklama: string;
  odeyen: string;
  dahil_olanlar: string[];
  created_at: string;
}

export type HarcamaGirdi = {
  tutar: number;
  aciklama: string;
  odeyen: string;
  dahil_olanlar: string[];
};
