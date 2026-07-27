import { db } from "@/lib/db/db";
import type { Technician } from "@/features/auth/types/auth.types";

const TECHNICIAN_META_KEY = "technician";

export async function getCachedTechnician(): Promise<Technician | null> {
  const row = await db.meta.get(TECHNICIAN_META_KEY);
  return (row?.value as Technician | undefined) ?? null;
}

export async function setCachedTechnician(
  technician: Technician,
): Promise<void> {
  await db.meta.put({ key: TECHNICIAN_META_KEY, value: technician });
}

export async function clearCachedTechnician(): Promise<void> {
  await db.meta.delete(TECHNICIAN_META_KEY);
}
