import {
  AnchorIcon,
  FoilBoardIcon,
  LifebuoyIcon,
  MarketBasketIcon,
  RopeIcon,
  SeashellIcon,
  StarfishIcon,
  SunHatIcon,
  SunglassesIcon,
} from "@/components/icons";

const AVATAR_IKONLAR = [
  FoilBoardIcon,
  MarketBasketIcon,
  SeashellIcon,
  SunglassesIcon,
  SunHatIcon,
];

const AKSAN_IKONLAR = [AnchorIcon, LifebuoyIcon, StarfishIcon, RopeIcon];

export function getCardDecor(index: number) {
  return {
    Avatar: AVATAR_IKONLAR[index % AVATAR_IKONLAR.length],
    Aksan: AKSAN_IKONLAR[index % AKSAN_IKONLAR.length],
  };
}
