"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Logo from "@/components/Logo";
import {
  INDUSTRIES,
  MATURITY_LEVELS,
  OPPORTUNITY_SUGGESTIONS,
  PAYMENT_TERMS,
  SERVICES,
  levelFromScore,
} from "@/lib/catalog";
import { makeFolio, toNumber } from "@/lib/format";
import { clearDraft, encodeShare, loadDraft, saveCurrent, saveDraft } from "@/lib/storage";
import { emptyProposal, type MaturityLevel, type PaymentTerms, type ProposalData, type ServiceId } from "@/lib/types";

const STEPS = [
  { id: "cliente", title: "Cliente", hint: "Datos del negocio y del contacto" },
  { id: "diagnostico", title: "Diagnóstico", hint: "Madurez en IA y oportunidades" },
  { id: "roi", title: "ROI", hint: "Resultados de la calculadora (opcional)" },
  { id: "servicio", title: "Servicio e inversión", hint: "Paquete, duración y precio" },
] as const;

type Errors = Partial<Record<keyof ProposalData, string>>;

function validate(step: number, d: ProposalData): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!d.businessName.trim()) e.businessName = "Escribe el nombre del negocio.";
    if (!d.industry.trim()) e.industry = "Indica el giro del negocio.";
    if (!d.contactName.trim()) e.contactName = "Escribe el nombre del contacto.";
    const digits = d.contactWhatsapp.replace(/\D/g, "");
    if (digits && digits.length !== 10 && digits.length !== 12 && digits.length !== 13)
      e.contactWhatsapp = "Usa 10 dígitos, p. ej. 999 123 4567.";
  }
  if (step === 1 && d.maturityScore) {
    const n = toNumber(d.maturityScore);
    if (n === null || n < 0 || n > 100) e.maturityScore = "El score va de 0 a 100.";
  }
  if (step === 3) {
    if (!d.services.length) e.services = "Selecciona al menos un servicio.";
    const min = toNumber(d.investmentMin);
    const max = toNumber(d.investmentMax);
    if (min === null && max === null) e.investmentMin = "Indica al menos un monto de inversión.";
    if (min !== null && max !== null && max < min) e.investmentMax = "El máximo debe ser mayor al mínimo.";
  }
  return e;
}

export default function ProposalForm() {
  const router = useRouter();
  const [data, setData] = useState<ProposalData>(emptyProposal);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [oppInput, setOppInput] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const draft = loadDraft();
    // "?nueva=1": si el borrador ya se generó como propuesta, empezamos de cero.
    const fresh = new URLSearchParams(window.location.search).get("nueva") === "1";
    if (draft && !(fresh && draft.folio)) setData(draft);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveDraft(data);
  }, [data, ready]);

  const set = <K extends keyof ProposalData>(key: K, value: ProposalData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const suggestedLevel = useMemo(() => {
    const n = toNumber(data.maturityScore);
    return n !== null && n >= 0 && n <= 100 ? levelFromScore(n) : null;
  }, [data.maturityScore]);

  const addOpportunity = (text: string) => {
    const t = text.trim();
    if (!t || data.opportunities.includes(t)) return;
    set("opportunities", [...data.opportunities, t]);
    setOppInput("");
  };

  const toggleService = (id: ServiceId) => {
    const next = data.services.includes(id) ? data.services.filter((s) => s !== id) : [...data.services, id];
    set("services", next);
    if (!data.duration && next.length === 1) {
      set("duration", SERVICES.find((s) => s.id === id)!.suggestedDuration);
    }
  };

  const next = () => {
    const e = validate(step, data);
    setErrors(e);
    if (Object.keys(e).length) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      generate();
    }
  };

  const generate = () => {
    for (let i = 0; i < STEPS.length; i++) {
      const e = validate(i, data);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(i);
        return;
      }
    }
    const final: ProposalData = {
      ...data,
      maturityLevel: data.maturityLevel || (suggestedLevel ?? ""),
      folio: data.folio || makeFolio(data.businessName),
      createdAt: data.createdAt || new Date().toISOString(),
    };
    saveCurrent(final);
    saveDraft(final);
    router.push(`/propuesta#d=${encodeShare(final)}`);
  };

  const reset = () => {
    if (!confirm("¿Borrar todos los datos del formulario?")) return;
    clearDraft();
    setData(emptyProposal());
    setErrors({});
    setStep(0);
  };

  const err = (k: keyof ProposalData) =>
    errors[k] ? <p className="mt-1.5 text-xs text-rose-400">{errors[k]}</p> : null;

  return (
    <main className="min-h-dvh pb-28">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-navy-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" aria-label="Inicio">
            <Logo className="h-8" />
          </Link>
          <button onClick={reset} className="text-xs text-slate-400 hover:text-white">
            Limpiar formulario
          </button>
        </div>
        {/* Progreso */}
        <div className="mx-auto max-w-3xl px-4 pb-3 sm:px-6">
          <ol className="grid grid-cols-4 gap-2">
            {STEPS.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className="w-full text-left"
                  disabled={i > step}
                >
                  <span
                    className={`block h-1 rounded-full transition ${
                      i <= step ? "bg-brand-gradient" : "bg-white/10"
                    }`}
                  />
                  <span
                    className={`mt-2 hidden text-xs sm:block ${i === step ? "text-white" : "text-slate-500"}`}
                  >
                    {i + 1}. {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-electric">
          Paso {step + 1} de {STEPS.length}
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">{STEPS[step].title}</h1>
        <p className="mt-1 text-sm text-slate-400">{STEPS[step].hint}</p>

        <form
          className="card mt-6 space-y-5 p-5 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
        >
          {step === 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="businessName">Nombre del negocio *</label>
                  <input id="businessName" className="input" placeholder="Ej. Panadería La Espiga"
                    value={data.businessName} onChange={(e) => set("businessName", e.target.value)} />
                  {err("businessName")}
                </div>
                <div>
                  <label className="label" htmlFor="industry">Giro *</label>
                  <input id="industry" className="input" list="industries" placeholder="Ej. Restaurantes y alimentos"
                    value={data.industry} onChange={(e) => set("industry", e.target.value)} />
                  <datalist id="industries">
                    {INDUSTRIES.map((i) => <option key={i} value={i} />)}
                  </datalist>
                  {err("industry")}
                </div>
                <div>
                  <label className="label" htmlFor="city">Ciudad / Estado</label>
                  <input id="city" className="input" placeholder="Ej. Mérida, Yucatán"
                    value={data.city} onChange={(e) => set("city", e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="contactName">Nombre del contacto *</label>
                  <input id="contactName" className="input" placeholder="Ej. María López" autoComplete="off"
                    value={data.contactName} onChange={(e) => set("contactName", e.target.value)} />
                  {err("contactName")}
                </div>
                <div>
                  <label className="label" htmlFor="contactRole">Puesto</label>
                  <input id="contactRole" className="input" placeholder="Ej. Directora general"
                    value={data.contactRole} onChange={(e) => set("contactRole", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="contactWhatsapp">WhatsApp del contacto</label>
                  <input id="contactWhatsapp" className="input" inputMode="tel" placeholder="999 123 4567"
                    value={data.contactWhatsapp} onChange={(e) => set("contactWhatsapp", e.target.value)} />
                  {err("contactWhatsapp")}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="maturityScore">Score de madurez (0–100)</label>
                  <input id="maturityScore" className="input" inputMode="numeric" placeholder="Ej. 42"
                    value={data.maturityScore} onChange={(e) => set("maturityScore", e.target.value)} />
                  {err("maturityScore")}
                </div>
                <div>
                  <label className="label" htmlFor="maturityLevel">Nivel</label>
                  <select id="maturityLevel" className="input"
                    value={data.maturityLevel} onChange={(e) => set("maturityLevel", e.target.value as MaturityLevel)}>
                    <option value="">{suggestedLevel ? `Automático: ${suggestedLevel}` : "Sin diagnóstico"}</option>
                    {MATURITY_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label" htmlFor="opp">Principales oportunidades o áreas a mejorar</label>
                <div className="flex gap-2">
                  <input id="opp" className="input" placeholder="Escribe una oportunidad y presiona Agregar"
                    value={oppInput} onChange={(e) => setOppInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); addOpportunity(oppInput); }
                    }} />
                  <button type="button" className="btn-ghost shrink-0" onClick={() => addOpportunity(oppInput)}>
                    Agregar
                  </button>
                </div>

                {data.opportunities.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {data.opportunities.map((o, i) => (
                      <li key={o} className="flex items-start gap-3 rounded-xl border border-cyan-electric/20 bg-cyan-electric/5 px-3 py-2.5 text-sm">
                        <span className="mt-0.5 font-display text-xs font-bold text-cyan-electric">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-slate-100">{o}</span>
                        <button type="button" aria-label="Quitar" className="text-slate-500 hover:text-rose-400"
                          onClick={() => set("opportunities", data.opportunities.filter((x) => x !== o))}>✕</button>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="mb-2 mt-4 text-xs text-slate-500">Sugerencias rápidas:</p>
                <div className="flex flex-wrap gap-2">
                  {OPPORTUNITY_SUGGESTIONS.filter((s) => !data.opportunities.includes(s)).map((s) => (
                    <button key={s} type="button" onClick={() => addOpportunity(s)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-electric/40 hover:text-white">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
                Todos los campos son opcionales. Si los dejas vacíos, la sección de ROI se omite en la propuesta.
              </p>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="label" htmlFor="monthlySavings">Ahorro mensual (MXN)</label>
                  <input id="monthlySavings" className="input" inputMode="decimal" placeholder="18,000"
                    value={data.monthlySavings} onChange={(e) => set("monthlySavings", e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="paybackMonths">Recuperación (meses)</label>
                  <input id="paybackMonths" className="input" inputMode="decimal" placeholder="3"
                    value={data.paybackMonths} onChange={(e) => set("paybackMonths", e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="roi12">ROI a 12 meses (%)</label>
                  <input id="roi12" className="input" inputMode="decimal" placeholder="240"
                    value={data.roi12} onChange={(e) => set("roi12", e.target.value)} />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <span className="label">Servicios propuestos *</span>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SERVICES.map((s) => {
                    const on = data.services.includes(s.id);
                    return (
                      <button key={s.id} type="button" onClick={() => toggleService(s.id)} aria-pressed={on}
                        className={`rounded-xl border p-4 text-left transition ${
                          on ? "border-cyan-electric/60 bg-cyan-electric/10 shadow-glow" : "border-white/10 bg-navy-900/60 hover:border-white/25"
                        }`}>
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-display font-semibold text-white">{s.short}</span>
                          <span className={`flex h-5 w-5 items-center justify-center rounded-md border text-[11px] ${
                            on ? "border-cyan-electric bg-cyan-electric text-navy-950" : "border-white/20"}`}>
                            {on ? "✓" : ""}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-slate-400">{s.pitch}</span>
                        <span className="mt-2 block text-[11px] text-teal-brand">Sugerido: {s.suggestedDuration}</span>
                      </button>
                    );
                  })}
                </div>
                {err("services")}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="duration">Duración estimada</label>
                  <input id="duration" className="input" placeholder="Ej. 8 semanas"
                    value={data.duration} onChange={(e) => set("duration", e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="investmentMin">Inversión mínima (MXN) *</label>
                  <input id="investmentMin" className="input" inputMode="decimal" placeholder="25,000"
                    value={data.investmentMin} onChange={(e) => set("investmentMin", e.target.value)} />
                  {err("investmentMin")}
                </div>
                <div>
                  <label className="label" htmlFor="investmentMax">Inversión máxima (MXN)</label>
                  <input id="investmentMax" className="input" inputMode="decimal" placeholder="40,000"
                    value={data.investmentMax} onChange={(e) => set("investmentMax", e.target.value)} />
                  {err("investmentMax")}
                </div>
                <div>
                  <label className="label" htmlFor="paymentTerms">Forma de pago</label>
                  <select id="paymentTerms" className="input" value={data.paymentTerms}
                    onChange={(e) => set("paymentTerms", e.target.value as PaymentTerms)}>
                    {Object.entries(PAYMENT_TERMS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-navy-900/80 px-4 py-3 text-sm">
                    <input type="checkbox" className="h-4 w-4 accent-cyan-400" checked={data.ivaIncluded}
                      onChange={(e) => set("ivaIncluded", e.target.checked)} />
                    Los montos incluyen IVA
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="consultant">Consultor responsable</label>
                  <input id="consultant" className="input" value={data.consultant}
                    onChange={(e) => set("consultant", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="notes">Notas o condiciones adicionales</label>
                  <textarea id="notes" rows={3} className="input resize-y" placeholder="Ej. Incluye 2 sesiones presenciales en sus instalaciones."
                    value={data.notes} onChange={(e) => set("notes", e.target.value)} />
                </div>
              </div>
            </>
          )}

          <button type="submit" hidden aria-hidden />
        </form>
      </div>

      {/* Barra de acciones fija (cómoda en móvil) */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/5 bg-navy-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button type="button" className="btn-ghost" onClick={() => (step ? setStep(step - 1) : router.push("/"))}>
            {step ? "Atrás" : "Inicio"}
          </button>
          <button type="button" className="btn-primary flex-1 sm:flex-none sm:px-8" onClick={next}>
            {step === STEPS.length - 1 ? "Generar propuesta" : "Continuar"}
          </button>
        </div>
      </div>
    </main>
  );
}
