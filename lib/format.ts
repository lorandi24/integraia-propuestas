const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

/** Convierte "25,000", "$25 000" o "25000.5" a número. Devuelve null si está vacío o es inválido. */
export const toNumber = (value: string): number | null => {
  const clean = value.replace(/[^\d.-]/g, "");
  if (!clean) return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : null;
};

export const money = (value: string | number): string => {
  const n = typeof value === "number" ? value : toNumber(value);
  return n === null ? "" : `${mxn.format(n)} MXN`;
};

export const longDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const addDays = (iso: string, days: number): string => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

/** Normaliza un número mexicano a formato wa.me (521 + 10 dígitos). */
export const toWhatsappNumber = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `521${digits}`;
  if (digits.length === 12 && digits.startsWith("52")) return `521${digits.slice(2)}`;
  return digits;
};

export const prettyPhone = (raw: string): string => {
  const d = raw.replace(/\D/g, "").slice(-10);
  return d.length === 10 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : raw;
};

export const makeFolio = (businessName: string): string => {
  const initials =
    businessName
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z ]/g, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 3)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "CLI";
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `IIA-${initials}-${ymd}-${rnd}`;
};
