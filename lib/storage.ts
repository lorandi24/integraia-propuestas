import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import { emptyProposal, type ProposalData } from "./types";

const DRAFT_KEY = "integraia:draft:v1";
const CURRENT_KEY = "integraia:current:v1";

const safe = <T,>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

const hydrate = (raw: unknown): ProposalData | null =>
  raw && typeof raw === "object" ? { ...emptyProposal(), ...(raw as Partial<ProposalData>) } : null;

export const saveDraft = (d: ProposalData) =>
  safe(() => localStorage.setItem(DRAFT_KEY, JSON.stringify(d)), undefined);

export const loadDraft = (): ProposalData | null =>
  safe(() => hydrate(JSON.parse(localStorage.getItem(DRAFT_KEY) || "null")), null);

export const clearDraft = () => safe(() => localStorage.removeItem(DRAFT_KEY), undefined);

export const saveCurrent = (d: ProposalData) =>
  safe(() => localStorage.setItem(CURRENT_KEY, JSON.stringify(d)), undefined);

export const loadCurrent = (): ProposalData | null =>
  safe(() => hydrate(JSON.parse(localStorage.getItem(CURRENT_KEY) || "null")), null);

/** Codifica la propuesta completa en el hash de la URL: el enlace funciona sin base de datos. */
export const encodeShare = (d: ProposalData): string => compressToEncodedURIComponent(JSON.stringify(d));

export const decodeShare = (s: string): ProposalData | null =>
  safe(() => hydrate(JSON.parse(decompressFromEncodedURIComponent(s) || "null")), null);
