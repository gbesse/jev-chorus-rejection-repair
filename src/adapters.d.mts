import type { Dossier, Document } from "./index.mjs";
export function importChorusExport(
  row: Record<string, unknown>,
  existingNumbers?: string[],
  options?: { uri?: string; at?: string },
): Dossier;
