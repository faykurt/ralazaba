"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Harcama, HarcamaGirdi } from "./types";

const POLL_MS = 7000;

export function useHarcamalar() {
  const [harcamalar, setHarcamalar] = useState<Harcama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getir = useCallback(async () => {
    const { data, error } = await supabase
      .from("harcamalar")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setHarcamalar(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Supabase Realtime kasıtlı olarak kullanılmıyor; basit polling ile senkron sağlanıyor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getir();
    const interval = setInterval(getir, POLL_MS);
    return () => clearInterval(interval);
  }, [getir]);

  const ekle = useCallback(
    async (girdi: HarcamaGirdi) => {
      const { error } = await supabase.from("harcamalar").insert(girdi);
      if (error) throw new Error(error.message);
      await getir();
    },
    [getir],
  );

  const guncelle = useCallback(
    async (id: string, girdi: HarcamaGirdi) => {
      const { error } = await supabase
        .from("harcamalar")
        .update(girdi)
        .eq("id", id);
      if (error) throw new Error(error.message);
      await getir();
    },
    [getir],
  );

  const sil = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("harcamalar").delete().eq("id", id);
      if (error) throw new Error(error.message);
      await getir();
    },
    [getir],
  );

  return { harcamalar, loading, error, ekle, guncelle, sil };
}
