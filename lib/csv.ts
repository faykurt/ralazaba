import type { KisiOzet } from "./settlement";

export function ozetCsvIndir(ozet: KisiOzet[]) {
  const baslik = "Kisi,Odedigi,Payi,Net Bakiye\n";
  const satirlar = ozet
    .map(
      (o) =>
        `${o.kisi},${Math.round(o.odedi)},${Math.round(o.payi)},${Math.round(o.net)}`,
    )
    .join("\n");

  // Excel'de Türkçe karakterlerin doğru görünmesi için BOM ekleniyor.
  const bom = String.fromCharCode(0xfeff);
  const csv = bom + baslik + satirlar;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ralazaba-ozet.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
