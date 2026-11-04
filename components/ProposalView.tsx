"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Logo from "@/components/Logo";
import ProposalDocument from "@/components/ProposalDocument";
import { WHATSAPP_INTEGRAIA } from "@/lib/catalog";
import { toWhatsappNumber } from "@/lib/format";
import { buildProposal, proposalToText, proposalToWhatsapp } from "@/lib/proposal";
import { decodeShare, encodeShare, loadCurrent, saveCurrent, saveDraft } from "@/lib/storage";
import type { ProposalData } from "@/lib/types";

const waUrl = (phone: string, text: string) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

export default function ProposalView() {
  const router = useRouter();
  const [data, setData] = useState<ProposalData | null>(null);
  const [clientMode, setClientMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const shared = params.get("d");
    const fromHash = shared ? decodeShare(shared) : null;
    setClientMode(params.get("c") === "1");
    setData(fromHash ?? loadCurrent());
    setLoaded(true);
  }, []);

  const proposal = useMemo(() => (data ? buildProposal(data) : null), [data]);

  const shareLink = useMemo(() => {
    if (!data || typeof window === "undefined") return "";
    return `${window.location.origin}/propuesta#d=${encodeShare(data)}&c=1`;
  }, [data]);

  useEffect(() => {
    if (proposal) document.title = `Propuesta ${proposal.data.businessName} – IntegraIA by EMET`;
  }, [proposal]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  };

  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    flash(msg);
  };

  const edit = () => {
    if (!data) return;
    saveDraft(data);
    saveCurrent(data);
    router.push("/nueva");
  };

  if (!loaded) return <div className="min-h-dvh" />;

  if (!proposal || !data) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
        <Logo className="h-12" />
        <h1 className="font-display text-2xl font-bold text-white">Aún no hay una propuesta</h1>
        <p className="max-w-md text-slate-400">Captura los datos del cliente para generar tu primera propuesta.</p>
        <Link href="/nueva?nueva=1" className="btn-primary">Crear propuesta</Link>
      </main>
    );
  }

  const waIntegra = waUrl(WHATSAPP_INTEGRAIA, proposalToWhatsapp(proposal, shareLink));
  const waAccept = waUrl(
    WHATSAPP_INTEGRAIA,
    `Hola, soy ${data.contactName} de ${data.businessName}. Revisé la propuesta ${data.folio} y me gustaría avanzar. ¿Cuándo podemos agendar la sesión de arranque?`,
  );
  const clientPhone = data.contactWhatsapp ? toWhatsappNumber(data.contactWhatsapp) : "";
  const waClient = clientPhone
    ? waUrl(
        clientPhone,
        `Hola ${data.contactName.split(" ")[0]}, te comparto la propuesta de IntegraIA by EMET para ${data.businessName}:\n\n${shareLink}\n\nQuedo atento a tus comentarios.`,
      )
    : "";

  return (
    <main className="min-h-dvh bg-navy-950 print:bg-white">
      {/* ---------- Barra de acciones ---------- */}
      <div className="no-print sticky top-0 z-30 border-b border-white/5 bg-navy-950/90 backdrop-blur">
        <div className="toolbar mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="Inicio" className="mr-auto">
            <Logo className="h-8" />
          </Link>

          {clientMode ? (
            <>
              <button className="btn-ghost" onClick={() => window.print()}>Descargar PDF</button>
              <a className="btn-wa" href={waAccept} target="_blank" rel="noopener noreferrer">Aceptar propuesta</a>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={edit}>Editar</button>
              <button className="btn-ghost" onClick={() => copy(proposalToText(proposal), "Texto copiado al portapapeles")}>
                Copiar texto
              </button>
              <button className="btn-ghost" onClick={() => copy(shareLink, "Enlace para el cliente copiado")}>
                Copiar enlace
              </button>
              <button className="btn-ghost" onClick={() => window.print()}>Descargar PDF</button>
              <a className="btn-wa" href={waIntegra} target="_blank" rel="noopener noreferrer">Enviar a IntegraIA</a>
              {waClient && (
                <a className="btn-wa" href={waClient} target="_blank" rel="noopener noreferrer">Enviar al cliente</a>
              )}
            </>
          )}
        </div>
      </div>

      {!clientMode && (
        <p className="no-print mx-auto max-w-5xl px-4 pt-4 text-xs text-slate-500 sm:px-6">
          Para PDF: en el diálogo de impresión elige <strong className="text-slate-300">Guardar como PDF</strong>, tamaño A4 y
          activa <strong className="text-slate-300">Gráficos de fondo</strong>.
        </p>
      )}

      <div className="print-area px-3 py-6 sm:px-6 sm:py-10">
        <ProposalDocument p={proposal} />
      </div>

      {toast && (
        <div role="status" className="no-print fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-cyan-electric/40 bg-navy-800 px-5 py-2.5 text-sm text-white shadow-glow">
          {toast}
        </div>
      )}
    </main>
  );
}
