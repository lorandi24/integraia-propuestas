import {
  MATURITY_COPY,
  PAYMENT_TERMS,
  levelFromScore,
  serviceById,
  type ServiceDef,
} from "./catalog";
import { addDays, longDate, money, prettyPhone, toNumber } from "./format";
import type { MaturityLevel, ProposalData } from "./types";

export const VALIDITY_DAYS = 15;

export interface Proposal {
  data: ProposalData;
  date: string;
  validUntil: string;
  serviceNames: string;
  executiveSummary: string[];
  situation: {
    intro: string;
    maturity: { score: number | null; level: Exclude<MaturityLevel, "">; text: string } | null;
    opportunities: string[];
  };
  value: { intro: string; pillars: { title: string; text: string }[]; services: ServiceDef[] };
  benefits: {
    items: string[];
    roi: {
      monthlySavings: string | null;
      annualSavings: string | null;
      payback: string | null;
      roi12: string | null;
    } | null;
  };
  investment: {
    amount: string;
    tax: string;
    payment: string;
    duration: string;
    conditions: string[];
  };
  nextSteps: { steps: { title: string; text: string }[]; cta: string };
}

const listJoin = (items: string[]) =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;

const DEFAULT_OPPORTUNITIES = [
  "Automatizar tareas administrativas repetitivas que hoy consumen horas del equipo",
  "Mejorar la velocidad y calidad de respuesta a clientes y prospectos",
  "Contar con información de ventas y operación en tiempo real para decidir mejor",
];

const BENEFITS_BY_SERVICE: Record<string, string[]> = {
  diagnostico: [
    "Claridad sobre qué procesos automatizar primero y cuánto pueden aportar",
    "Decisiones de inversión basadas en datos, no en intuición",
  ],
  implementacion: [
    "Reducción de horas dedicadas a tareas operativas y administrativas",
    "Atención a clientes más rápida y disponible fuera de horario",
    "Menos errores humanos en captura y seguimiento",
  ],
  capacitacion: [
    "Equipo más productivo y seguro al usar herramientas de IA",
    "Menor dependencia de proveedores externos para tareas cotidianas",
  ],
  acompanamiento: [
    "Adopción sostenida: las soluciones se usan y mejoran mes a mes",
    "Medición continua del impacto en ventas, costos y tiempo",
  ],
  integral: [
    "Un solo responsable de punta a punta, sin fricción entre proveedores",
    "Resultados medibles desde los primeros 30 a 60 días",
    "Equipo capacitado y procesos documentados que se quedan en la empresa",
  ],
};

export function buildProposal(data: ProposalData): Proposal {
  const created = data.createdAt || new Date().toISOString();
  const services = data.services.map(serviceById);
  const serviceNames = listJoin(services.map((s) => s.name)) || "servicios de IntegraIA";

  // --- Diagnóstico
  const score = toNumber(data.maturityScore);
  const level =
    data.maturityLevel || (score !== null ? levelFromScore(Math.max(0, Math.min(100, score))) : "");
  const maturity = level
    ? { score: score === null ? null : Math.round(score), level, text: MATURITY_COPY[level] }
    : null;

  const opportunities = data.opportunities.length ? data.opportunities : DEFAULT_OPPORTUNITIES;

  // --- Inversión
  const min = toNumber(data.investmentMin);
  const max = toNumber(data.investmentMax);
  let amount = "A definir según alcance final";
  if (min !== null && max !== null && max > min) amount = `${money(min).replace(" MXN", "")} a ${money(max)}`;
  else if (min !== null || max !== null) amount = money((min ?? max)!);
  const tax = data.ivaIncluded ? "IVA incluido" : "Más IVA";
  const duration = data.duration || services[0]?.suggestedDuration || "Por definir";

  // --- ROI
  const savings = toNumber(data.monthlySavings);
  const payback = toNumber(data.paybackMonths);
  const roi12 = toNumber(data.roi12);
  const hasRoi = savings !== null || payback !== null || roi12 !== null;
  const roi = hasRoi
    ? {
        monthlySavings: savings !== null ? money(savings) : null,
        annualSavings: savings !== null ? money(savings * 12) : null,
        payback:
          payback !== null ? `${payback} ${payback === 1 ? "mes" : "meses"}` : null,
        roi12: roi12 !== null ? `${roi12}%` : null,
      }
    : null;

  // --- Resumen ejecutivo
  const place = data.city ? ` en ${data.city}` : "";
  const industry = data.industry ? `, del giro ${data.industry.toLowerCase()}${place},` : place ? `${place},` : "";
  const summary: string[] = [
    `${data.businessName}${industry} tiene la oportunidad de incorporar la inteligencia artificial para trabajar con mayor eficiencia, atender mejor a sus clientes y crecer sin aumentar proporcionalmente sus costos.`,
  ];
  if (maturity) {
    summary.push(
      `De acuerdo con el diagnóstico de madurez en IA${
        maturity.score !== null ? `, con un resultado de ${maturity.score}/100` : ""
      }, la empresa se encuentra en el nivel “${maturity.level}”. Identificamos ${opportunities.length} oportunidades concretas de mejora con impacto directo en la operación.`,
    );
  } else {
    summary.push(
      `En nuestras conversaciones identificamos ${opportunities.length} oportunidades concretas de mejora con impacto directo en la operación.`,
    );
  }
  summary.push(
    `Proponemos ${services.length > 1 ? "los servicios de" : "el servicio de"} ${serviceNames}, con una duración estimada de ${duration.toLowerCase()} y una inversión de ${amount} (${tax.toLowerCase()}).`,
  );
  if (roi) {
    const parts: string[] = [];
    if (roi.monthlySavings) parts.push(`un ahorro estimado de ${roi.monthlySavings} al mes`);
    if (roi.payback) parts.push(`recuperación de la inversión en ${roi.payback}`);
    if (roi.roi12) parts.push(`un retorno de ${roi.roi12} en los primeros 12 meses`);
    summary.push(`Con base en la calculadora de ROI, proyectamos ${listJoin(parts)}.`);
  }

  // --- Beneficios
  const benefitSet = new Set<string>();
  data.services.forEach((id) => BENEFITS_BY_SERVICE[id]?.forEach((b) => benefitSet.add(b)));
  if (!benefitSet.size) BENEFITS_BY_SERVICE.integral.forEach((b) => benefitSet.add(b));

  // --- Condiciones
  const conditions = [
    `Forma de pago: ${PAYMENT_TERMS[data.paymentTerms]}.`,
    "Facturación electrónica (CFDI 4.0) disponible.",
    `Vigencia de la propuesta: ${VALIDITY_DAYS} días naturales a partir de su emisión.`,
    "Las licencias de software de terceros (si se requieren) se cotizan por separado y quedan a nombre del cliente.",
    "Toda la información del negocio se trata con estricta confidencialidad.",
  ];

  const firstName = data.contactName.split(" ")[0] || data.contactName;

  return {
    data,
    date: longDate(created),
    validUntil: longDate(addDays(created, VALIDITY_DAYS)),
    serviceNames,
    executiveSummary: summary,
    situation: {
      intro: `Hoy ${data.businessName} opera con procesos que dependen en gran medida del trabajo manual. Esto limita la capacidad de crecer, genera tiempos de respuesta variables y consume horas valiosas del equipo en tareas que pueden automatizarse.`,
      maturity,
      opportunities,
    },
    value: {
      intro: `En IntegraIA by EMET no vendemos tecnología: implementamos soluciones prácticas que tu equipo entiende, usa y aprovecha desde el primer mes.`,
      pillars: [
        { title: "Enfoque en resultados", text: "Cada acción se vincula a un indicador: tiempo ahorrado, ventas o costos." },
        { title: "A la medida de una pyme", text: "Herramientas accesibles, sin infraestructura costosa ni contratos eternos." },
        { title: "Tu equipo al centro", text: "Capacitamos a las personas para que la IA se quede en la empresa." },
      ],
      services,
    },
    benefits: { items: [...benefitSet], roi },
    investment: { amount, tax, payment: PAYMENT_TERMS[data.paymentTerms], duration, conditions },
    nextSteps: {
      steps: [
        { title: "Confirmación", text: "Aprobación de la propuesta por WhatsApp o correo." },
        { title: "Anticipo y arranque", text: "Pago del anticipo y agenda de la sesión de inicio (kick-off)." },
        { title: "Primeros resultados", text: "Entregables iniciales y primeras mejoras en las primeras semanas." },
      ],
      cta: `${firstName}, estamos listos para comenzar. Responde a este mensaje o escríbenos por WhatsApp y agendamos la sesión de arranque esta misma semana.`,
    },
  };
}

/** Versión en texto plano para copiar/pegar (correo, WhatsApp, CRM). */
export function proposalToText(p: Proposal): string {
  const d = p.data;
  const L: string[] = [];
  const h = (t: string) => L.push("", t.toUpperCase(), "─".repeat(Math.min(t.length, 40)));

  L.push("PROPUESTA DE SERVICIOS – IntegraIA by EMET");
  L.push(`Folio: ${d.folio} · Fecha: ${p.date}`);
  L.push("");
  L.push(`Cliente: ${d.businessName}${d.industry ? ` (${d.industry})` : ""}`);
  L.push(`Atención: ${d.contactName}${d.contactRole ? `, ${d.contactRole}` : ""}`);
  if (d.contactWhatsapp) L.push(`WhatsApp: ${prettyPhone(d.contactWhatsapp)}`);

  h("1. Resumen ejecutivo");
  p.executiveSummary.forEach((s) => L.push(s, ""));

  h("2. Situación actual y oportunidades");
  L.push(p.situation.intro);
  if (p.situation.maturity) {
    const m = p.situation.maturity;
    L.push("", `Nivel de madurez en IA: ${m.level}${m.score !== null ? ` (${m.score}/100)` : ""}`, m.text);
  }
  L.push("", "Oportunidades detectadas:");
  p.situation.opportunities.forEach((o) => L.push(`• ${o}`));

  h("3. Propuesta de valor y alcance");
  L.push(p.value.intro);
  p.value.services.forEach((s) => {
    L.push("", `▸ ${s.name}`, s.pitch, "Alcance:");
    s.scope.forEach((x) => L.push(`  • ${x}`));
    L.push("Entregables:");
    s.deliverables.forEach((x) => L.push(`  • ${x}`));
  });

  h("4. Beneficios esperados");
  p.benefits.items.forEach((b) => L.push(`• ${b}`));
  if (p.benefits.roi) {
    const r = p.benefits.roi;
    L.push("", "Retorno estimado:");
    if (r.monthlySavings) L.push(`• Ahorro mensual: ${r.monthlySavings} (${r.annualSavings} al año)`);
    if (r.payback) L.push(`• Recuperación de la inversión: ${r.payback}`);
    if (r.roi12) L.push(`• ROI a 12 meses: ${r.roi12}`);
  }

  h("5. Inversión y condiciones");
  L.push(`Inversión: ${p.investment.amount} (${p.investment.tax})`);
  L.push(`Duración estimada: ${p.investment.duration}`);
  p.investment.conditions.forEach((c) => L.push(`• ${c}`));
  if (d.notes.trim()) L.push("", `Notas: ${d.notes.trim()}`);

  h("6. Siguientes pasos");
  p.nextSteps.steps.forEach((s, i) => L.push(`${i + 1}. ${s.title}: ${s.text}`));
  L.push("", p.nextSteps.cta);
  L.push("", `${d.consultant}`, "WhatsApp: 999 297 8891");
  L.push(`Propuesta válida hasta el ${p.validUntil}.`);

  return L.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Mensaje corto para WhatsApp con enlace a la propuesta. */
export function proposalToWhatsapp(p: Proposal, link: string): string {
  const d = p.data;
  const lines = [
    `*Propuesta IntegraIA by EMET* · ${d.folio}`,
    "",
    `*Cliente:* ${d.businessName}${d.industry ? ` (${d.industry})` : ""}`,
    `*Contacto:* ${d.contactName}${d.contactWhatsapp ? ` · ${prettyPhone(d.contactWhatsapp)}` : ""}`,
    `*Servicio:* ${p.value.services.map((s) => s.short).join(", ")}`,
    `*Duración:* ${p.investment.duration}`,
    `*Inversión:* ${p.investment.amount} (${p.investment.tax})`,
  ];
  if (p.situation.maturity)
    lines.push(
      `*Madurez IA:* ${p.situation.maturity.level}${
        p.situation.maturity.score !== null ? ` (${p.situation.maturity.score}/100)` : ""
      }`,
    );
  if (p.benefits.roi?.monthlySavings) lines.push(`*Ahorro estimado:* ${p.benefits.roi.monthlySavings}/mes`);
  if (p.benefits.roi?.roi12) lines.push(`*ROI 12 meses:* ${p.benefits.roi.roi12}`);
  lines.push("", "Ver propuesta completa:", link);
  return lines.join("\n");
}
