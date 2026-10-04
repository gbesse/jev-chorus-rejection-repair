import { document } from "./io.mjs";
export function importChorusExport(
  row,
  existingNumbers = [],
  {
    uri = "fichier:chorus.json",
    at = new Date().toISOString().slice(0, 10),
  } = {},
) {
  // Contrat d’export local explicite, distinct du contrat SOAP/REST officiel.
  if (!row || !Number.isSafeInteger(row.montantTtcCentimes))
    throw new TypeError("Montant en centimes requis");
  const statuses = {
    Recyclée: "RECYCLEE",
    Suspendue: "SUSPENDUE",
    Rejetée: "REJETEE",
  };
  const status = statuses[row.statut] ?? row.statut;
  return {
    id: "chorus-" + row.numeroFacture,
    invoice: {
      docId: "facture",
      number: row.numeroFacture,
      totalCents: row.montantTtcCentimes,
    },
    rejection: {
      docId: "retour",
      status,
      code: row.codeMotif,
      message: row.motif,
    },
    existingNumbers,
    documents: [
      document(
        "facture",
        JSON.stringify({
          numeroFacture: row.numeroFacture,
          montantTtcCentimes: row.montantTtcCentimes,
        }),
        { uri, date: at, kind: "export", licence: "Privé" },
      ),
      document(
        "retour",
        JSON.stringify({
          statut: row.statut,
          codeMotif: row.codeMotif,
          motif: row.motif,
        }),
        { uri, date: at, kind: "export", licence: "Privé" },
      ),
    ],
  };
}
