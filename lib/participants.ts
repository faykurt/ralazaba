export const KATILIMCILAR = [
  "Fatih",
  "Dilan",
  "Boran",
  "Hazan",
  "Mami",
  "Şeval",
  "Ali",
  "Güneş",
  "Ferdi",
  "Nursima",
  "Halil",
  "Elif",
  "Selman",
  "Xart Enes",
] as const;

export type Katilimci = (typeof KATILIMCILAR)[number];
