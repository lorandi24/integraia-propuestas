import Image from "next/image";
import Logo from "@/components/Logo";
import mark from "@/public/logo-integraia-mark.png";
import { prettyPhone } from "@/lib/format";
import type { Proposal } from "@/lib/proposal";

const Check = () => (
  <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-teal-brand" fill="currentColor" aria-hidden>
    <path d="M8.1 14.3 3.8 10l1.4-1.4 2.9 2.9 6.7-6.7 1.4 1.4z" />
  </svg>
);

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="doc-section mb-10 last:mb-0">
      <h2 className="doc-h2">
        <span className="doc-num">{String(n).padStart(2, "0")}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="avoid-break rounded-xl border border-slate-200 bg-gradient-to-br from-white to-cyan-50/60 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-navy-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function ProposalDocument({ p }: { p: Proposal }) {
  const d = p.data;
  const roi = p.benefits.roi;
  const m = p.situation.maturity;
  let n = 0;

  return (
    <div className="space-y-8 print:space-y-0">
      {/* ---------- PORTADA ---------- */}
      <article className="doc-page doc-cover flex min-h-[85vh] flex-col sm:aspect-[210/297] sm:min-h-0 overflow-hidden bg-navy-900 p-8 text-white sm:p-14">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-electric/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-teal-brand/20 blur-3xl" />

        <Image src={mark} alt="" aria-hidden sizes="400px" priority
          className="pointer-events-none absolute -right-16 top-1/4 h-[55%] w-auto opacity-[0.07] sm:-right-10 sm:opacity-[0.12]" />

        <div className="relative flex items-start justify-between gap-4">
          <Logo className="h-12 sm:h-14" priority />
          <div className="text-right text-xs text-slate-300">
            <p className="font-semibold text-cyan-electric">Folio</p>
            <p className="font-mono">{d.folio}</p>
          </div>
        </div>

        <div className="relative my-auto py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-electric">Propuesta de servicios</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
            Inteligencia Artificial
            <br />
            <span className="text-cyan-electric">para hacer crecer</span>
            <br />
            tu negocio
          </h1>
          <div className="mt-8 h-1 w-24 rounded-full bg-brand-gradient" />
          <p className="mt-8 text-sm uppercase tracking-widest text-slate-400">Preparada para</p>
          <p className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{d.businessName}</p>
          <p className="mt-1 text-slate-300">
            {d.industry}
            {d.city ? ` · ${d.city}` : ""}
          </p>
        </div>

        <div className="relative grid gap-6 border-t border-white/15 pt-6 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Atención</p>
            <p className="mt-1 font-medium">{d.contactName}</p>
            {d.contactRole && <p className="text-slate-300">{d.contactRole}</p>}
            {d.contactWhatsapp && <p className="text-slate-300">{prettyPhone(d.contactWhatsapp)}</p>}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Fecha</p>
            <p className="mt-1 font-medium">{p.date}</p>
            <p className="text-slate-300">Vigente hasta {p.validUntil}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-400">Elaborada por</p>
            <p className="mt-1 font-medium">{d.consultant}</p>
            <p className="text-slate-300">WhatsApp 999 297 8891</p>
          </div>
        </div>
      </article>

      {/* ---------- CONTENIDO ---------- */}
      <article className="doc-page px-6 py-10 sm:px-14 sm:py-14">
        <div className="mb-10 flex items-center justify-between border-b border-slate-200 pb-4 print:mb-8">
          <Logo className="h-8" variant="light" priority />
          <p className="text-right text-xs text-slate-500">
            {d.businessName} · <span className="font-mono">{d.folio}</span>
          </p>
        </div>

        <Section n={++n} title="Resumen ejecutivo">
          {p.executiveSummary.map((t) => (
            <p key={t} className="doc-p">{t}</p>
          ))}
        </Section>

        <Section n={++n} title="Situación actual y oportunidades detectadas">
          <p className="doc-p">{p.situation.intro}</p>
          {m && (
            <div className="avoid-break my-5 flex flex-col gap-4 rounded-2xl bg-navy-900 p-5 text-white sm:flex-row sm:items-center">
              {m.score !== null && (
                <div className="relative h-24 w-24 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00E5FF" strokeWidth="3"
                      strokeDasharray={`${m.score} 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-2xl font-bold">{m.score}</span>
                    <span className="text-[10px] text-slate-400">/ 100</span>
                  </span>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-electric">Madurez en IA</p>
                <p className="font-display text-xl font-semibold">Nivel {m.level}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{m.text}</p>
              </div>
            </div>
          )}
          <p className="mb-3 mt-5 text-sm font-semibold text-navy-900">Oportunidades detectadas</p>
          <ol className="grid gap-2.5 sm:grid-cols-2">
            {p.situation.opportunities.map((o, i) => (
              <li key={o} className="avoid-break flex gap-3 rounded-xl border border-slate-200 p-3.5 text-sm text-slate-700">
                <span className="font-display text-sm font-bold text-teal-brand">{String(i + 1).padStart(2, "0")}</span>
                {o}
              </li>
            ))}
          </ol>
        </Section>

        <Section n={++n} title="Propuesta de valor y alcance de servicios">
          <p className="doc-p">{p.value.intro}</p>
          <div className="my-5 grid gap-3 sm:grid-cols-3">
            {p.value.pillars.map((x) => (
              <div key={x.title} className="avoid-break rounded-xl border-l-4 border-cyan-electric bg-slate-50 p-4">
                <p className="text-sm font-semibold text-navy-900">{x.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{x.text}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {p.value.services.map((s) => (
              <div key={s.id} className="avoid-break overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-gradient-to-r from-navy-900 to-navy-700 px-5 py-3.5">
                  <p className="font-display text-lg font-semibold text-white">{s.name}</p>
                  <p className="text-xs text-cyan-100/80">{s.pitch}</p>
                </div>
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Alcance</p>
                    <ul className="space-y-1.5">
                      {s.scope.map((x) => (
                        <li key={x} className="flex gap-2 text-sm text-slate-700"><Check />{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Entregables</p>
                    <ul className="space-y-1.5">
                      {s.deliverables.map((x) => (
                        <li key={x} className="flex gap-2 text-sm text-slate-700"><Check />{x}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section n={++n} title={roi ? "Beneficios esperados y retorno de inversión" : "Beneficios esperados"}>
          <ul className="mb-5 space-y-2">
            {p.benefits.items.map((b) => (
              <li key={b} className="flex gap-2 text-[15px] text-slate-700"><Check />{b}</li>
            ))}
          </ul>
          {roi && (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                {roi.monthlySavings && <Stat label="Ahorro mensual" value={roi.monthlySavings.replace(" MXN", "")} sub={`${roi.annualSavings} al año`} />}
                {roi.payback && <Stat label="Recuperación" value={roi.payback} sub="de la inversión" />}
                {roi.roi12 && <Stat label="ROI a 12 meses" value={roi.roi12} sub="retorno estimado" />}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Estimaciones basadas en la calculadora de ROI de IntegraIA con la información proporcionada por el cliente. Los resultados reales dependen de la adopción y del contexto del negocio.
              </p>
            </>
          )}
        </Section>

        <Section n={++n} title="Inversión y condiciones">
          <div className="avoid-break mb-5 grid overflow-hidden rounded-2xl border border-slate-200 sm:grid-cols-[1.4fr_1fr]">
            <div className="bg-navy-900 p-6 text-white">
              <p className="text-xs uppercase tracking-wider text-cyan-electric">Inversión</p>
              <p className="mt-1 font-display text-2xl font-bold sm:text-3xl">{p.investment.amount}</p>
              <p className="mt-1 text-sm text-slate-300">{p.investment.tax}</p>
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-wider text-slate-500">Duración estimada</p>
              <p className="mt-1 font-display text-xl font-semibold text-navy-900">{p.investment.duration}</p>
              <p className="mt-3 text-xs uppercase tracking-wider text-slate-500">Servicios</p>
              <p className="mt-1 text-sm text-slate-700">{p.value.services.map((s) => s.short).join(" · ")}</p>
            </div>
          </div>
          <ul className="space-y-1.5">
            {p.investment.conditions.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-slate-700"><Check />{c}</li>
            ))}
          </ul>
          {d.notes.trim() && (
            <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-semibold text-navy-900">Notas: </span>
              {d.notes.trim()}
            </p>
          )}
        </Section>

        <Section n={++n} title="Siguientes pasos">
          <ol className="mb-6 grid gap-3 sm:grid-cols-3">
            {p.nextSteps.steps.map((s, i) => (
              <li key={s.title} className="avoid-break rounded-xl border border-slate-200 p-4">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-navy-950">{i + 1}</span>
                <p className="mt-2 text-sm font-semibold text-navy-900">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="avoid-break relative overflow-hidden rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <p className="font-display text-xl font-semibold sm:text-2xl">¿Listos para empezar?</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">{p.nextSteps.cta}</p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-navy-950">
                WhatsApp: 999 297 8891
              </p>
            </div>
          </div>
        </Section>

        <div className="avoid-break mt-12 flex justify-center">
          <Logo kind="full" className="h-24" priority />
        </div>
        <div className="avoid-break mt-8 grid gap-8 border-t border-slate-200 pt-8 text-sm sm:grid-cols-2">
          <div>
            <div className="h-12 border-b border-slate-300" />
            <p className="mt-2 font-medium text-navy-900">{d.consultant}</p>
            <p className="text-xs text-slate-500">IntegraIA by EMET</p>
          </div>
          <div>
            <div className="h-12 border-b border-slate-300" />
            <p className="mt-2 font-medium text-navy-900">{d.contactName}</p>
            <p className="text-xs text-slate-500">Acepto · {d.businessName}</p>
          </div>
        </div>
        <p className="mt-8 text-center text-[11px] text-slate-400">
          Propuesta {d.folio} · Emitida el {p.date} · Válida hasta el {p.validUntil}
        </p>
      </article>
    </div>
  );
}
