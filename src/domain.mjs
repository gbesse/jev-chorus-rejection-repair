import { text, list, cents, date, ref, check, pair } from "./index.mjs";

const states = {
  RECYCLEE: {
    actions: [
      "Corriger destinataire, code service ou engagement suivant le motif.",
      "Faire vérifier la correction avant renvoi.",
    ],
    codes: ["DEST_INC", "ADR_ERR", "REJ_ADR"],
  },
  SUSPENDUE: {
    actions: [
      "Ajouter la pièce explicitement demandée.",
      "Reprendre le traitement depuis la facture suspendue.",
    ],
    codes: ["PJ_MANQUANTE"],
  },
  REJETEE: {
    actions: [
      "Examiner le motif avec le destinataire.",
      "Préparer une nouvelle facture si le rejet est confirmé.",
    ],
    codes: ["DOUBLON", "MONTANT", "AUTRE"],
  },
};
const meanings = {
  DEST_INC: "Le destinataire de la facture est incorrect.",
  ADR_ERR: "L’adressage de la facture est incorrect.",
  REJ_ADR: "Le destinataire ou le code service est incorrect.",
  PJ_MANQUANTE: "Une pièce justificative demandée manque.",
  DOUBLON: "Une facture portant le même numéro existe déjà.",
  MONTANT: "Le montant de la facture est contesté.",
  AUTRE: "Le motif ne relève pas d’une catégorie précisée.",
};
export function prepare(x) {
  const f = x.invoice,
    r = x.rejection;
  if (!f || !r) throw new TypeError("invoice et rejection requis");
  text(f.number);
  cents(f.totalCents);
  text(r.status);
  text(r.code);
  const state = states[r.status];
  const refs = ref(f.docId, r.docId);
  const duplicate = (x.existingNumbers ?? []).includes(f.number);
  return {
    checks: [
      check("statut", "Statut pris en charge", state ? true : null, refs),
      check(
        "code",
        "Code compatible avec le statut",
        state && Object.hasOwn(meanings, r.code)
          ? state.codes.includes(r.code)
          : null,
        refs,
      ),
      check(
        "doublon",
        "Contrôle du doublon déclaré",
        r.code === "DOUBLON" ? duplicate : !duplicate,
        refs,
        "Vérifier le numéro dans l’export des factures existantes.",
      ),
    ],
    pairs: [
      pair(
        "motif",
        "Motif libre / catégorie annoncée",
        r.message,
        meanings[r.code],
        ref(r.docId),
        "Le motif libre de gauche décrit-il la même cause que la catégorie de droite ?",
      ),
    ],
    outputs: {
      checklist: state?.actions ?? [
        "Statut inconnu : demander une lecture humaine.",
      ],
      propositionUniquement: true,
      envoiExecute: false,
      limite:
        "Le code de motif est normalisé à l’import ; aucune nomenclature exhaustive ni API Chorus n’est revendiquée.",
    },
  };
}

function requiredDoc(o) {
  if (!o || typeof o !== "object") throw new TypeError("Objet métier requis");
  text(o.docId, "docId requis");
}
export function validateInput(x) {
  requiredDoc(x.invoice);
  requiredDoc(x.rejection);
  if (x.existingNumbers !== undefined && !Array.isArray(x.existingNumbers))
    throw new TypeError("existingNumbers doit être un tableau");
}
