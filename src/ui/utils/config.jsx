export function formatDate(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // months are 0-based
  const day = date.getDate()
  return `${year}/${month}/${day}`
}


export const locale = {
  "lang": {
    "locale": "fr_FR",
    "placeholder": "Sélectionner une date",
    "rangePlaceholder": ["Date de début", "Date de fin"],
    "today": "Aujourd’hui",
    "now": "Maintenant",
    "backToToday": "Retour à aujourd’hui",
    "ok": "OK",
    "clear": "Effacer",
    "month": "Mois",
    "year": "Année",
    "timeSelect": "Choisir l’heure",
    "dateSelect": "Choisir la date",
    "monthSelect": "Choisir un mois",
    "yearSelect": "Choisir une année",
    "decadeSelect": "Choisir une décennie",
    "yearFormat": "YYYY",
    "fieldDateFormat": "DD/MM/YYYY",
    "cellDateFormat": "D",
    "fieldDateTimeFormat": "DD/MM/YYYY HH:mm:ss",
    "monthFormat": "MMMM",
    "fieldWeekFormat": "YYYY-wo",
    "monthBeforeYear": false,
    "previousMonth": "Mois précédent (PageUp)",
    "nextMonth": "Mois suivant (PageDown)",
    "previousYear": "Année précédente (Ctrl + gauche)",
    "nextYear": "Année suivante (Ctrl + droite)",
    "previousDecade": "Décennie précédente",
    "nextDecade": "Décennie suivante",
    "previousCentury": "Siècle précédent",
    "nextCentury": "Siècle suivant",
    "shortWeekDays": ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    "shortMonths": [
      "Janv",
      "Févr",
      "Mars",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sept",
      "Oct",
      "Nov",
      "Déc"
    ]
  },
  "timePickerLocale": {
    "placeholder": "Sélectionner l’heure"
  }
}


const statuses = [
  { id: 1, name: "Transféré", color: "#f39c12" },
  { id: 2, name: "Reçu", color: "#27ae60" },
  { id: 3, name: "Fabrication", color: "#2980b9" },
  { id: 4, name: "Fabriqué", color: "#3498db" },
  { id: 5, name: "Montage", color: "#9b59b6" },
  { id: 6, name: "Monté", color: "#8e44ad" },
  { id: 7, name: "Préparation", color: "#16a085" },
  { id: 8, name: "Préparé", color: "#1abc9c" },
  { id: 9, name: "Contrôle", color: "#d35400" },
  { id: 10, name: "Contrôlé", color: "#e67e22" },
  { id: 11, name: "Validé", color: "#2ecc71" },
  { id: 12, name: "Livraison", color: "#34495e" },
  { id: 13, name: "Livré", color: "#e74c3c" },
];

export function getStatus(id) {
  return statuses.find(status => status.id === id) || null;
}


export function uppercaseFirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}




export function getResumeStatus(value) {
  const statuses = {
    1: { label: "Nouveau", color: "gray" },
    2: { label: "Invitation", color: "blue" },
    3: { label: "Évaluation", color: "orange" },
    4: { label: "Accepté", color: "green" },
    5: { label: "Engagé", color: "purple" }
  };

  return statuses[value] || { label: "Inconnu", color: "red" };
}
