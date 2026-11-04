import Image from "next/image";
import mark from "@/public/logo-integraia-mark.png";
import full from "@/public/logo-integraia.png";

/**
 * Logo de IntegraIA by EMET.
 * - kind="lockup" (por defecto): isotipo del lobo + logotipo tipográfico. Legible en tamaños pequeños.
 * - kind="full": logotipo original completo (lobo + "IntegraIA").
 * Los PNG son transparentes, por lo que funcionan sobre fondos claros y oscuros.
 * next/image sirve WebP/AVIF redimensionado automáticamente.
 */
export default function Logo({
  className = "h-10",
  variant = "dark",
  kind = "lockup",
  priority = false,
}: {
  className?: string;
  variant?: "dark" | "light";
  kind?: "lockup" | "full";
  priority?: boolean;
}) {
  if (kind === "full") {
    return (
      <Image
        src={full}
        alt="IntegraIA by EMET"
        priority={priority}
        sizes="320px"
        className={`${className} w-auto object-contain`}
      />
    );
  }

  const dark = variant === "dark";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src={mark}
        alt=""
        aria-hidden
        priority={priority}
        sizes="96px"
        className="h-full w-auto object-contain"
      />
      <span className="leading-none">
        <span className="block font-serif text-[1.15em] font-semibold tracking-tight">
          <span className={dark ? "text-[#E6D8C3]" : "text-[#8A7660]"}>Integra</span>
          <span className={dark ? "text-cyan-electric" : "text-[#3F5F9A]"}>IA</span>
        </span>
        <span
          className={`mt-0.5 block text-[0.5em] font-medium uppercase tracking-[0.28em] ${
            dark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          by EMET
        </span>
      </span>
    </span>
  );
}
