"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muestra /public/logo-integraia.png. Si el archivo no existe, cae a un
 * isotipo SVG de marcador de posición (reemplázalo subiendo tu PNG).
 */
export default function Logo({
  className = "h-10",
  variant = "dark",
  showText = true,
}: {
  className?: string;
  variant?: "dark" | "light";
  showText?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // El error puede ocurrir antes de la hidratación: lo verificamos al montar.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  const textColor = variant === "dark" ? "text-white" : "text-navy-900";

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={ref}
        src="/logo-integraia.png"
        alt="IntegraIA by EMET"
        className={`${className} w-auto object-contain`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} title="Placeholder: sube /public/logo-integraia.png">
      <svg viewBox="0 0 48 48" className="h-full w-auto" aria-hidden="true">
        <defs>
          <linearGradient id="lg-iia" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#00E5FF" />
            <stop offset="1" stopColor="#0FB5AE" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="46" height="46" rx="12" fill="#060d1f" stroke="url(#lg-iia)" strokeWidth="2" />
        <path d="M16 13v22M24 13v22" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 24h8m0 0v-8m0 8v8" stroke="url(#lg-iia)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="16" r="2.5" fill="#00E5FF" />
        <circle cx="32" cy="32" r="2.5" fill="#0FB5AE" />
      </svg>
      {showText && (
        <span className={`leading-none ${textColor}`}>
          <span className="block font-display text-[1.05em] font-bold tracking-tight">
            Integra<span className="text-cyan-electric">IA</span>
          </span>
          <span className="block text-[0.55em] font-medium uppercase tracking-[0.2em] opacity-70">by EMET</span>
        </span>
      )}
    </span>
  );
}
