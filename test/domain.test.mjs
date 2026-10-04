import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { analyze } from "../src/index.mjs";
const base = JSON.parse(
  await readFile(new URL("../examples/dossier.json", import.meta.url), "utf8"),
);
const clone = structuredClone;

import { importChorusExport } from "../src/adapters.mjs";
test("Statut inconnu reste en revue", async () => {
  const x = clone(base);
  x.rejection.status = "INCONNU";
  assert.equal(
    (await analyze(x)).findings.find((f) => f.id === "statut").status,
    "a_revoir",
  );
});
test("Un doublon est contrôlé sur les numéros exacts", async () => {
  const x = clone(base);
  x.rejection.status = "REJETEE";
  x.rejection.code = "DOUBLON";
  x.existingNumbers = [x.invoice.number];
  const r = await analyze(x);
  assert.equal(r.findings.find((f) => f.id === "doublon").status, "etaye");
  assert.equal(r.outputs.envoiExecute, false);
});
test("Suspendue demande des pièces, pas une nouvelle facture", async () => {
  const x = importChorusExport({
    numeroFacture: "42",
    montantTtcCentimes: 1,
    statut: "Suspendue",
    codeMotif: "PJ_MANQUANTE",
    motif: "Une pièce justificative demandée manque.",
  });
  const r = await analyze(x);
  assert.ok(r.outputs.checklist[0].includes("pièce"));
  assert.equal(r.status, "etaye");
});
