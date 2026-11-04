import type { MaturityLevel, PaymentTerms, ServiceId } from "./types";

export const WHATSAPP_INTEGRAIA = "5219992978891";

export interface ServiceDef {
  id: ServiceId;
  name: string;
  short: string;
  pitch: string;
  scope: string[];
  deliverables: string[];
  suggestedDuration: string;
}

export const SERVICES: ServiceDef[] = [
  {
    id: "diagnostico",
    name: "Diagnóstico de Madurez en IA",
    short: "Diagnóstico",
    pitch:
      "Evaluamos procesos, datos y equipo para identificar dónde la IA genera retorno rápido y medible.",
    scope: [
      "Entrevistas con dirección y responsables de área",
      "Mapeo de procesos clave y tareas repetitivas",
      "Evaluación de herramientas, datos y nivel digital actual",
      "Priorización de casos de uso por impacto y facilidad",
    ],
    deliverables: [
      "Reporte ejecutivo de madurez en IA",
      "Matriz de oportunidades priorizadas",
      "Hoja de ruta de 90 días",
    ],
    suggestedDuration: "2 a 3 semanas",
  },
  {
    id: "implementacion",
    name: "Implementación de Soluciones con IA",
    short: "Implementación",
    pitch:
      "Diseñamos y ponemos en marcha automatizaciones y asistentes de IA conectados a tu operación diaria.",
    scope: [
      "Diseño de flujos automatizados (ventas, atención, administración)",
      "Configuración de asistentes de IA y chatbots (WhatsApp, web)",
      "Integración con herramientas existentes (hojas de cálculo, CRM, correo)",
      "Pruebas, ajustes y puesta en producción",
    ],
    deliverables: [
      "Automatizaciones funcionando en producción",
      "Manual de uso y documentación técnica",
      "Tablero básico de indicadores",
    ],
    suggestedDuration: "4 a 8 semanas",
  },
  {
    id: "capacitacion",
    name: "Capacitación en IA para Equipos",
    short: "Capacitación",
    pitch:
      "Formamos a tu equipo para usar IA de forma práctica, segura y aplicada a sus tareas reales.",
    scope: [
      "Talleres prácticos por área (ventas, administración, operación)",
      "Uso productivo de asistentes de IA (redacción, análisis, atención)",
      "Buenas prácticas de seguridad y privacidad de la información",
      "Biblioteca de instrucciones (prompts) personalizada para el negocio",
    ],
    deliverables: [
      "Sesiones de capacitación en vivo",
      "Material didáctico y biblioteca de prompts",
      "Constancias de participación",
    ],
    suggestedDuration: "2 a 4 semanas",
  },
  {
    id: "acompanamiento",
    name: "Acompañamiento Estratégico",
    short: "Acompañamiento",
    pitch:
      "Te acompañamos mes a mes para consolidar la adopción, medir resultados y escalar lo que funciona.",
    scope: [
      "Sesiones de seguimiento quincenales con dirección",
      "Monitoreo de indicadores y ajustes a las soluciones",
      "Soporte por WhatsApp en horario laboral",
      "Identificación continua de nuevas oportunidades",
    ],
    deliverables: [
      "Reporte mensual de avances y resultados",
      "Ajustes y mejoras continuas",
      "Plan de escalamiento trimestral",
    ],
    suggestedDuration: "3 a 6 meses",
  },
  {
    id: "integral",
    name: "Programa Integral de Transformación con IA",
    short: "Programa integral",
    pitch:
      "Diagnóstico, implementación, capacitación y acompañamiento en un solo programa con un responsable único.",
    scope: [
      "Diagnóstico completo y hoja de ruta",
      "Implementación de 2 a 4 soluciones prioritarias",
      "Capacitación del equipo involucrado",
      "Acompañamiento y medición de resultados",
    ],
    deliverables: [
      "Hoja de ruta y matriz de oportunidades",
      "Soluciones de IA en producción",
      "Equipo capacitado y biblioteca de prompts",
      "Reportes mensuales de resultados",
    ],
    suggestedDuration: "3 a 4 meses",
  },
];

export const serviceById = (id: ServiceId) => SERVICES.find((s) => s.id === id)!;

export const INDUSTRIES = [
  "Comercio minorista",
  "Restaurantes y alimentos",
  "Servicios profesionales",
  "Salud y clínicas",
  "Educación",
  "Inmobiliaria",
  "Manufactura",
  "Distribución y logística",
  "Turismo y hotelería",
  "Construcción",
  "Agencia / Marketing",
];

export const OPPORTUNITY_SUGGESTIONS = [
  "Atención a clientes por WhatsApp 24/7",
  "Seguimiento automático de prospectos y cotizaciones",
  "Generación de contenido para redes sociales",
  "Captura y conciliación de facturas / CFDI",
  "Reportes de ventas e inventario automáticos",
  "Agenda y recordatorios de citas",
  "Respuestas a preguntas frecuentes",
  "Capacitación del equipo en herramientas de IA",
];

export const MATURITY_LEVELS: Exclude<MaturityLevel, "">[] = [
  "Inicial",
  "Explorador",
  "En desarrollo",
  "Avanzado",
  "Líder",
];

export const levelFromScore = (score: number): Exclude<MaturityLevel, ""> => {
  if (score < 20) return "Inicial";
  if (score < 40) return "Explorador";
  if (score < 60) return "En desarrollo";
  if (score < 80) return "Avanzado";
  return "Líder";
};

export const MATURITY_COPY: Record<Exclude<MaturityLevel, "">, string> = {
  Inicial:
    "La empresa aún no utiliza inteligencia artificial de forma estructurada. Esto representa una gran ventaja: hay oportunidades de alto impacto y bajo costo que pueden implementarse rápidamente.",
  Explorador:
    "Existe interés y algunos usos aislados de herramientas de IA, pero sin procesos definidos ni medición de resultados. El siguiente paso es ordenar y priorizar.",
  "En desarrollo":
    "La empresa ya aplica IA en algunas áreas. El reto ahora es integrarla a los procesos clave, capacitar al equipo y medir el impacto en ventas y costos.",
  Avanzado:
    "La IA forma parte de varios procesos del negocio. La oportunidad está en conectar soluciones, automatizar de punta a punta y escalar lo que ya funciona.",
  Líder:
    "La empresa es referente en adopción de IA en su sector. El enfoque está en innovación continua, nuevos modelos de servicio y ventaja competitiva sostenida.",
};

export const PAYMENT_TERMS: Record<PaymentTerms, string> = {
  "50-50": "50% de anticipo para iniciar y 50% contra entrega",
  "30-40-30": "30% de anticipo, 40% a mitad del proyecto y 30% contra entrega",
  "100": "Pago único al inicio (aplica 5% de descuento)",
  mensual: "Pagos mensuales iguales durante la vigencia del servicio",
};
