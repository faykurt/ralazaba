import { SeashellIcon, StarfishIcon, SunIcon } from "./icons";

export default function TotalBanner({ toplam }: { toplam: number }) {
  return (
    <div className="sticky top-0 z-10 -mx-4 mb-4 overflow-hidden rounded-b-2xl shadow-md sm:mx-0 sm:rounded-2xl">
      <div className="relative bg-gradient-to-b from-turkuaz-light/70 via-turkuaz-light/30 to-kum px-5 py-5 text-navy">
        <SunIcon className="absolute top-3 right-4 h-9 w-9 text-yellow-400" />
        <StarfishIcon className="absolute bottom-3 left-5 h-6 w-6 text-mercan/60" />
        <SeashellIcon className="absolute bottom-3 left-16 h-6 w-6 text-navy/30" />
        <p className="relative text-sm font-medium text-navy/70">Toplam Harcama</p>
        <p className="relative text-3xl font-extrabold">
          {toplam.toLocaleString("tr-TR")} TL
        </p>
      </div>
    </div>
  );
}
