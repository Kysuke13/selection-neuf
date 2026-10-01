"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="admin-refresh"
      disabled={pending}
      aria-busy={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" data-spinning={pending}>
        <path
          fill="currentColor"
          d="M13.65 2.35A7 7 0 1 0 14.9 8h-1.5a5.5 5.5 0 1 1-1.6-4.4L9.5 6H15V.5z"
        />
      </svg>
      {pending ? "Actualisation…" : "Actualiser"}
    </button>
  );
}
