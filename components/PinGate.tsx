"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { SailboatIcon } from "./icons";

const PIN = "1453";
const STORAGE_KEY = "ralazaba_pin_ok";

type Durum = "bilinmiyor" | "acik" | "kilitli";

function subscribe() {
  return () => {};
}

function getSnapshot(): Durum {
  return localStorage.getItem(STORAGE_KEY) === "true" ? "acik" : "kilitli";
}

function getServerSnapshot(): Durum {
  return "bilinmiyor";
}

export default function PinGate({ children }: { children: React.ReactNode }) {
  const durum = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [, girisYapildi] = useState(0);
  const [girilenPin, setGirilenPin] = useState("");
  const [hata, setHata] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (girilenPin === PIN) {
      localStorage.setItem(STORAGE_KEY, "true");
      girisYapildi((n) => n + 1);
    } else {
      setHata(true);
      setGirilenPin("");
    }
  }

  if (durum === "bilinmiyor") {
    return null;
  }

  if (durum === "kilitli") {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-navy px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
        >
          <SailboatIcon className="mx-auto mb-1 h-10 w-10 text-navy" />
          <h1 className="font-script mb-1 text-4xl text-navy">
            Ralazaba Tatilde
          </h1>
          <p className="mb-6 text-sm text-navy/60">
            Devam etmek için PIN girin
          </p>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            autoFocus
            value={girilenPin}
            onChange={(e) => {
              setGirilenPin(e.target.value.replace(/[^0-9]/g, ""));
              setHata(false);
            }}
            className="mb-3 w-full rounded-lg border border-navy/20 px-4 py-3 text-center text-2xl tracking-[0.5em]"
            maxLength={8}
          />
          {hata && (
            <p className="mb-3 text-sm text-mercan">
              PIN yanlış, tekrar deneyin.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-turkuaz py-3 text-lg font-semibold text-white active:scale-[0.98]"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
