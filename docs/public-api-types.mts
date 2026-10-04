import { analyze, toHtml, type Dossier, type Report } from "../src/index.mjs";
import { createJevClient } from "../src/jev.mjs";
import * as adapters from "../src/adapters.mjs";
const dossier: Dossier = {
  invoice: {
    docId: "a",
    number: "FAC-42",
    totalCents: 10000,
  },
  existingNumbers: [],
  rejection: {
    docId: "b",
    status: "RECYCLEE",
    code: "DEST_INC",
    message: "La facture a été adressée à la mauvaise structure destinataire.",
  },
  id: "jev-chorus-rejection-repair-dev-paraphrase",
  documents: [
    {
      id: "a",
      text: 'dossier.invoice : {"number": "FAC-42", "totalCents": 10000}',
      source: {
        uri: "fixture:a",
        date: "2026-10-04",
        licence: "CC0",
        kind: "synthetique",
      },
    },
    {
      id: "b",
      text: 'dossier.rejection : {"status": "RECYCLEE", "code": "DEST_INC", "message": "La facture a été adressée à la mauvaise structure destinataire."}',
      source: {
        uri: "fixture:b",
        date: "2026-10-04",
        licence: "CC0",
        kind: "synthetique",
      },
    },
  ],
};
const report: Report = await analyze(dossier, {
  mode: "jev",
  provider: createJevClient({ apiKey: "exemple-de-type" }),
});
const html: string = toHtml(report);
void html;
void adapters;
// @ts-expect-error Un dossier vide ne respecte pas le contrat métier.
await analyze({ id: "incomplet", documents: [] });
