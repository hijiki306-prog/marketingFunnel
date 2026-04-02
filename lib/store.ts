import { kv } from "@vercel/kv";
import { Funnel } from "./types";

const KEY = "funnels";

export async function getFunnels(): Promise<Funnel[]> {
  const data = await kv.get<Funnel[]>(KEY);
  return data ?? [];
}

export async function saveFunnels(funnels: Funnel[]): Promise<void> {
  await kv.set(KEY, funnels);
}

export async function getFunnelById(id: string): Promise<Funnel | undefined> {
  const funnels = await getFunnels();
  return funnels.find((f) => f.id === id);
}

export async function createFunnel(
  data: Omit<Funnel, "id" | "createdAt" | "updatedAt">
): Promise<Funnel> {
  const funnels = await getFunnels();
  const now = new Date().toISOString();
  const newFunnel: Funnel = {
    ...data,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  funnels.push(newFunnel);
  await saveFunnels(funnels);
  return newFunnel;
}

export async function updateFunnel(
  id: string,
  data: Partial<Funnel>
): Promise<Funnel | null> {
  const funnels = await getFunnels();
  const index = funnels.findIndex((f) => f.id === id);
  if (index === -1) return null;
  funnels[index] = {
    ...funnels[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await saveFunnels(funnels);
  return funnels[index];
}

export async function deleteFunnel(id: string): Promise<boolean> {
  const funnels = await getFunnels();
  const index = funnels.findIndex((f) => f.id === id);
  if (index === -1) return false;
  funnels.splice(index, 1);
  await saveFunnels(funnels);
  return true;
}
