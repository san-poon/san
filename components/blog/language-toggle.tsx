"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Language = "en" | "ne";

export function LanguageToggle({
  containerId,
  storageKey = "preferred-lang",
}: {
  containerId: string;
  storageKey?: string;
}) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(storageKey)) as Language | null;
    if (saved === "en" || saved === "ne") setLang(saved);
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = document.getElementById(containerId);
    if (!container) return;
    const enEl = container.querySelector<HTMLElement>('[data-slot="content-en"]');
    const neEl = container.querySelector<HTMLElement>('[data-slot="content-ne"]');
    if (enEl && neEl) {
      if (lang === "en") {
        enEl.classList.remove("hidden");
        neEl.classList.add("hidden");
      } else {
        neEl.classList.remove("hidden");
        enEl.classList.add("hidden");
      }
    }
    localStorage.setItem(storageKey, lang);
  }, [lang, containerId, storageKey]);

  const isEN = lang === "en";

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isEN ? "default" : "outline"}
        size="sm"
        onClick={() => setLang("en")}
      >
        EN
      </Button>
      <Button
        variant={!isEN ? "default" : "outline"}
        size="sm"
        onClick={() => setLang("ne")}
      >
        NE
      </Button>
    </div>
  );
}


