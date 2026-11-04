import Link from "next/link";
import Logo from "@/components/Logo";

const FEATURES = [
  {
    t: "Formulario guiado",
    d: "4 pasos: cliente, diagnóstico, ROI e inversión. Menos de 5 minutos.",
    i: "M9 5h10M9 12h10M9 19h10M4 5h.01M4 12h.01M4 19h.01",
  },
  {
    t: "Propuesta profesional",
    d: "Portada, resumen ejecutivo, alcance, ROI, inversión y siguientes pasos.",
    i: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  },
  {
    t: "PDF y WhatsApp",
    d: "Descarga una versión limpia para imprimir o envíala con un enlace directo.",
    i: "M12 3v12m0 0l-4-4m4 4l4-4M5 21h14",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-electric/15 blur-[120px]" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <Logo className="h-10" priority />
        <Link href="/nueva?nueva=1" className="btn-ghost hidden sm:inline-flex">
          Nueva propuesta
        </Link>
      </header>

      <section className="relative mx-auto max-w-4xl px-4 pb-16 pt-6 text-center sm:px-6 sm:pt-10">
        <div className="relative mx-auto mb-8 w-fit">
          <div className="absolute inset-0 -z-10 rounded-full bg-cyan-electric/10 blur-3xl" />
          <Logo kind="full" priority className="h-36 sm:h-48" />
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-electric/30 bg-cyan-electric/10 px-3 py-1 text-xs font-medium text-cyan-electric">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-electric" />
          Herramienta para consultores IntegraIA
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
          Propuestas de IA para pymes,{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">listas en minutos</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Captura los datos del cliente, el resultado de su diagnóstico de madurez y su ROI estimado.
          Obtén una propuesta comercial profesional, lista para enviar por WhatsApp o en PDF.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/nueva?nueva=1" className="btn-primary w-full px-8 py-4 text-base sm:w-auto">
            Generar nueva propuesta
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-6-6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href="/propuesta" className="btn-ghost w-full px-8 py-4 text-base sm:w-auto">
            Ver última propuesta
          </Link>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-6xl gap-4 px-4 pb-24 sm:grid-cols-3 sm:px-6">
        {FEATURES.map((f) => (
          <div key={f.t} className="card p-6">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-electric/30 bg-cyan-electric/10 text-cyan-electric">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d={f.i} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-white">{f.t}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.d}</p>
          </div>
        ))}
      </section>

      <footer className="relative border-t border-white/5 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} IntegraIA by EMET · Hecho en México
      </footer>
    </main>
  );
}
