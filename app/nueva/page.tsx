import type { Metadata } from "next";
import ProposalForm from "@/components/ProposalForm";

export const metadata: Metadata = { title: "Nueva propuesta – IntegraIA by EMET" };

export default function NuevaPage() {
  return <ProposalForm />;
}
