export type ServiceId =
  | "diagnostico"
  | "implementacion"
  | "capacitacion"
  | "acompanamiento"
  | "integral";

export type MaturityLevel =
  | ""
  | "Inicial"
  | "Explorador"
  | "En desarrollo"
  | "Avanzado"
  | "Líder";

export type PaymentTerms = "50-50" | "100" | "mensual" | "30-40-30";

export interface ProposalData {
  // Cliente
  businessName: string;
  industry: string;
  city: string;
  contactName: string;
  contactRole: string;
  contactWhatsapp: string;
  // Diagnóstico
  maturityScore: string; // 0–100, opcional
  maturityLevel: MaturityLevel;
  opportunities: string[];
  // ROI (opcionales)
  monthlySavings: string;
  paybackMonths: string;
  roi12: string;
  // Servicio e inversión
  services: ServiceId[];
  duration: string;
  investmentMin: string;
  investmentMax: string;
  ivaIncluded: boolean;
  paymentTerms: PaymentTerms;
  consultant: string;
  notes: string;
  // Metadatos
  folio: string;
  createdAt: string; // ISO
}

export const emptyProposal = (): ProposalData => ({
  businessName: "",
  industry: "",
  city: "",
  contactName: "",
  contactRole: "",
  contactWhatsapp: "",
  maturityScore: "",
  maturityLevel: "",
  opportunities: [],
  monthlySavings: "",
  paybackMonths: "",
  roi12: "",
  services: [],
  duration: "",
  investmentMin: "",
  investmentMax: "",
  ivaIncluded: false,
  paymentTerms: "50-50",
  consultant: "Oscar Lorandi · IntegraIA by EMET",
  notes: "",
  folio: "",
  createdAt: "",
});
