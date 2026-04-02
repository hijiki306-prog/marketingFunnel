import FunnelForm from "@/app/components/FunnelForm";
import { getFunnelById } from "@/lib/store";
import { notFound } from "next/navigation";

export default async function EditFunnelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const funnel = await getFunnelById(id);
  if (!funnel) notFound();
  return <FunnelForm initialData={funnel} funnelId={id} />;
}
