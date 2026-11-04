import type { Metadata } from "next";
import ProposalView from "@/components/ProposalView";

export const metadata: Metadata = { title: "Propuesta – IntegraIA by EMET" };

export default function PropuestaPage() {
  return <ProposalView />;
}
