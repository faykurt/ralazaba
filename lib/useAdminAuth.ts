"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const EPOSTA_ALANI = "ralazaba.app";

function kullaniciAdindanEposta(kullaniciAdi: string) {
  return `${kullaniciAdi.trim().toLowerCase()}@${EPOSTA_ALANI}`;
}

export function useAdminAuth() {
  const [yukleniyor, setYukleniyor] = useState(true);
  const [girisYapildi, setGirisYapildi] = useState(false);

  useEffect(() => {
    let aktif = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!aktif) return;
      setGirisYapildi(!!data.session);
      setYukleniyor(false);
    });
    const { data: abonelik } = supabase.auth.onAuthStateChange((_olay, oturum) => {
      setGirisYapildi(!!oturum);
    });
    return () => {
      aktif = false;
      abonelik.subscription.unsubscribe();
    };
  }, []);

  const giris = useCallback(async (kullaniciAdi: string, sifre: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: kullaniciAdindanEposta(kullaniciAdi),
      password: sifre,
    });
    if (error) throw new Error("Kullanıcı adı veya şifre yanlış.");
  }, []);

  const cikis = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { yukleniyor, girisYapildi, giris, cikis };
}
