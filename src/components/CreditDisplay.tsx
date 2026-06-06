"use client";

import { useEffect, useState, useCallback } from "react";
import { Coins } from "lucide-react";

export function CreditDisplay() {
  const [credits, setCredits] = useState<number | null>(null);

  const fetchCredits = useCallback(async () => {
    try {
      const res = await fetch("/api/user/credits");
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  if (credits === null) return null;

  return (
    <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      <Coins className="h-3.5 w-3.5" />
      {credits}
    </div>
  );
}

export { CreditDisplay as CreditDisplayInner };
