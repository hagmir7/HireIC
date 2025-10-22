// export function formatDate(date) {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1 // months are 0-based
//   const day = date.getDate()
//   return `${year}/${month}/${day}`
// }

import { useNavigate } from "react-router-dom";

export function formatDate(isoDate) {
  if (!isoDate) return ''

  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return ''

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
    hour12: false,
  }

  return new Intl.DateTimeFormat('fr-FR', options).format(date)
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


const InvetationStatus = {
    1: { label: "En attente", color: "gray" },
    2: { label: "Planifié", color: "blue" },
    3: { label: "En cours", color: "orange" },
    4: { label: "Achevé", color: "green" },
    5: { label: "Expiré", color: "red" },
    6: { label: "Annulé", color: "purple" }
  };

export function InvitationStatus() {
  return {
    1: { label: "En attente", color: "gray" },
    2: { label: "Planifié", color: "blue" },
    3: { label: "Appel manqué", color: "orange" },
    4: { label: "Achevé", color: "green" },
    5: { label: "Expiré", color: "red" },
    6: { label: "Annulé", color: "purple" },
  };
}

export function getInvitationStatus(value) {
  return InvitationStatus()[value] || { label: "Inconnu", color: "black" };
}

export async function handleShow(path, width = 1000, height = 800) {
    try {
        if (window.electron && typeof window.electron.openShow === 'function') {
            await window.electron.openShow({ path, width, height });
        } else {
            navigate(`/layout/${path}`);
        }
    } catch (error) {
        console.error('Error navigating to resume:', error);
    }
}



export async function downloadFiles(url) {
  try {
    await window.electron.ipcRenderer.invoke('download-file', url);
  } catch (error) {
    console.error(error);
    message.error('Erreur lors du téléchargement');
  }
};



export async function handlePrint(url) {
   window.open(url, '_blank');
}

