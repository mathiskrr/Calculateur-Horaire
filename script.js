/// Eléments du DOM fréquemment utilisés
const heureArriveeElem = document.getElementById("heureArrivee");
const heurePauseElem = document.getElementById("heurePause");
const heureRepriseElem = document.getElementById("heureReprise");
const dureeTravailElem = document.getElementById("dureeTravail");
const resultatElem = document.getElementById("resultat");
const historiqueElem = document.getElementById("historique");
const themeButton = document.getElementById("themeToggleButton");
const languageButton = document.getElementById("languageToggleButton");
const versionElem = document.getElementById("appVersion");

const appVersion = "2.5";
const HISTORY_KEY = "historiqueArr";
const LANGUAGE_KEY = "lang-mode";
const THEME_KEY = "theme-mode";
const LAST_RESULT_KEY = "last-result";
const ANNOUNCEMENT_KEY = "v2-5-announcement-seen";

const translations = {
  fr: {
    title: "Calculateur Horaire",
    subtitle:
      "Entrez vos horaires de la journée pour connaître instantanément votre heure de fin.",
    sectionInputs: "Saisie des horaires",
    sectionHistory: "Historique",
    labelArrival: "Heure d'arrivée",
    labelBreak: "Début de pause déjeuner",
    labelResume: "Reprise après pause",
    labelDuration: "Durée de travail prévue",
    calculateButton: "Calculer mon heure de fin",
    clearHistoryButton: "Tout effacer",
    versionDate: "Avr 2026",
    timeHours: "heure(s)",
    timeMinutes: "minute(s)",
    resultTemplate: (heureFin, duree) =>
      `Vous devez finir à ${heureFin} pour travailler ${duree} au total.`,
    historyTemplate: (date, duree, arr, pause, reprise, fin) =>
      `${date} - Durée de travail : ${duree}, Arrivée à ${arr}, Pause à ${pause}, Reprise à ${reprise} => Fin de la journée à ${fin}`,
    errorTitle: "Erreur",
    invalidInputs:
      "Veuillez remplir tous les champs correctement. Assurez-vous que la durée de travail est comprise entre 1 minute et 12 heures.",
    invalidSchedule:
      "Vérifiez vos horaires ! L'heure d'arrivée doit être antérieure à l'heure de pause et l'heure de pause doit être antérieure à l'heure de reprise.",
    invalidBreak:
      "Vérifiez vos horaires ! Assurez-vous que la durée de pause est d'au moins 30 minutes et que les horaires sont cohérents.",
    confirmTitle: "Êtes-vous sûr ?",
    confirmDeleteEntry: "Cette entrée sera supprimée définitivement.",
    confirmDeleteHistory: "Tout l'historique sera supprimé définitivement.",
    confirmYes: "Oui",
    confirmNo: "Non",
    deletedEntry: "Votre enregistrement a été supprimé.",
    deletedHistory: "Votre historique a été supprimé.",
    emptyHistory: "Il n'y a pas d'historique à supprimer.",
    langAria: "Passer en anglais",
    v2Title: "🚀 Calculateur Horaire V2 est disponible",
    v2Message: `<div style="text-align:left;line-height:1.55">
<b>✨ Nouveautés majeures</b><br>
• Interface moderne et 100% responsive<br>
• Mode clair / sombre + FR / EN<br>
• Historique optimisé avec suppression instantanée<br>
• Notifications et confirmations améliorées<br>
• Nouveau bouton contact pour signaler un bug ou proposer une idée 💡
</div>`,
    v2Button: "Voir les nouveautés",
  },
  en: {
    title: "Work Hours Calculator",
    subtitle:
      "Enter your daily schedule to instantly get your end-of-day time.",
    sectionInputs: "Schedule input",
    sectionHistory: "History",
    labelArrival: "Start time",
    labelBreak: "Lunch break start",
    labelResume: "Back from break",
    labelDuration: "Planned work duration",
    calculateButton: "Calculate end time",
    clearHistoryButton: "Clear all",
    versionDate: "Apr 2026",
    timeHours: "hour(s)",
    timeMinutes: "minute(s)",
    resultTemplate: (heureFin, duree) =>
      `You should finish at ${heureFin} to work ${duree} in total.`,
    historyTemplate: (date, duree, arr, pause, reprise, fin) =>
      `${date} - Work duration: ${duree}, Start at ${arr}, Break at ${pause}, Resume at ${reprise} => End time ${fin}`,
    errorTitle: "Error",
    invalidInputs:
      "Please fill in all fields correctly. Make sure work duration is between 1 minute and 12 hours.",
    invalidSchedule:
      "Check your schedule! Start time must be before break time, and break time must be before resume time.",
    invalidBreak:
      "Check your schedule! Ensure break duration is at least 30 minutes and times are consistent.",
    confirmTitle: "Are you sure?",
    confirmDeleteEntry: "This entry will be permanently deleted.",
    confirmDeleteHistory: "All history will be permanently deleted.",
    confirmYes: "Yes",
    confirmNo: "No",
    deletedEntry: "Your entry has been deleted.",
    deletedHistory: "Your history has been deleted.",
    emptyHistory: "There is no history to delete.",
    langAria: "Switch to French",
    v2Title: "🚀 Work Hours Calculator V2 is now available",
    v2Message: `<div style="text-align:left;line-height:1.55">
<b>✨ Major updates</b><br>
• Modern and fully responsive interface<br>
• Light / dark mode + FR / EN switch<br>
• Optimized history with instant deletion<br>
• Improved notifications and confirmations<br>
• New contact button to report a bug or suggest an idea 💡
</div>`,
    v2Button: "See what's new",
  },
};

const contactButton = document.getElementById("contactButton");

const getLanguage = () => localStorage.getItem(LANGUAGE_KEY) || "fr";
let currentLanguage = getLanguage();

const t = (key) => translations[currentLanguage][key];

const showError = (message) => {
  Notiflix.Notify.failure(`${t("errorTitle")} · ${message}`);
};

const showSuccess = (message) => {
  Notiflix.Notify.success(message);
};

const confirmAction = (message, onConfirm) => {
  Notiflix.Confirm.show(
    t("confirmTitle"),
    message,
    t("confirmYes"),
    t("confirmNo"),
    onConfirm,
    () => {},
    {
      borderRadius: "14px",
      width: "360px",
      titleColor: "#1f2937",
      okButtonBackground: "#2f6ff6",
      cancelButtonBackground: "#94a3b8",
    },
  );
};

const updateVersionText = () => {
  versionElem.textContent = `Version ${appVersion} - ${t("versionDate")}`;
};

const updateLanguageButtonUI = () => {
  const nextLanguage = currentLanguage === "fr" ? "en" : "fr";

  const flagSrc =
    nextLanguage === "fr"
      ? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1eb-1f1f7.svg"
      : "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f1fa-1f1f8.svg";

  const flagAlt = nextLanguage === "fr" ? "Drapeau français" : "US flag";

  const label =
    currentLanguage === "fr" ? "Passer en anglais" : "Switch to French";

  languageButton.innerHTML = `<img src="${flagSrc}" alt="${flagAlt}">`;
  languageButton.setAttribute("aria-label", label);
  languageButton.title = label;
};

const updateThemeButtonUI = () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  themeButton.title =
    currentLanguage === "fr"
      ? isDark
        ? "Passer en mode clair"
        : "Passer en mode sombre"
      : isDark
        ? "Switch to light mode"
        : "Switch to dark mode";

  themeButton.setAttribute(
    "aria-label",
    currentLanguage === "fr"
      ? isDark
        ? "Passer en mode clair"
        : "Passer en mode sombre"
      : isDark
        ? "Switch to light mode"
        : "Switch to dark mode",
  );
};

const applyTranslations = () => {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });
  updateLanguageButtonUI();
  updateThemeButtonUI();
  updateContactButtonUI();
  updateVersionText();
  renderHistory();
};

// Fonction pour formater la durée en un format lisible
const formatDuration = (duration) => {
  const [hours, minutes] = duration.split(":");
  const minutesValue = parseInt(minutes, 10);
  return `${parseInt(hours, 10)} ${t("timeHours")} ${
    minutesValue > 0 ? minutesValue + " " + t("timeMinutes") : ""
  }`.trim();
};

// Fonction utilitaire pour convertir une heure en objet Date
const convertToDateTime = (heureStr) => {
  const currentDate = new Date();
  const [hour, minute] = heureStr.split(":");
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    hour,
    minute,
  );
};

const toHistoryText = (entry) =>
  t("historyTemplate")(
    entry.date,
    formatDuration(entry.dureeTravail),
    entry.heureArrivee,
    entry.heurePause,
    entry.heureReprise,
    entry.heureFin,
  );

const parseLegacyHistoryString = (value) => {
  const frenchPattern =
    /^\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\s*-\s*Durée de travail\s*:\s*([^,]+),\s*Arrivée à\s*(\d{1,2}:\d{2}),\s*Pause à\s*(\d{1,2}:\d{2}),\s*Reprise à\s*(\d{1,2}:\d{2})\s*=>\s*Fin de la journée à\s*(\d{1,2}:\d{2})\s*$/;
  const englishPattern =
    /^\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\s*-\s*Work duration\s*:\s*([^,]+),\s*Start at\s*(\d{1,2}:\d{2}),\s*Break at\s*(\d{1,2}:\d{2}),\s*Resume at\s*(\d{1,2}:\d{2})\s*=>\s*End time\s*(\d{1,2}:\d{2})\s*$/;

  const match = value.match(frenchPattern) || value.match(englishPattern);
  if (!match) {
    return null;
  }

  const durationPart = match[2];
  const frenchDuration = durationPart.match(
    /(\d+) heure\(s\)(?:\s+(\d+) minute\(s\))?/,
  );
  const englishDuration = durationPart.match(
    /(\d+) hour\(s\)(?:\s+(\d+) minute\(s\))?/,
  );
  const durationMatch = frenchDuration || englishDuration;
  if (!durationMatch) {
    return null;
  }

  const hours = durationMatch[1].padStart(2, "0");
  const minutes = (durationMatch[2] || "0").padStart(2, "0");

  return {
    date: match[1],
    dureeTravail: `${hours}:${minutes}`,
    heureArrivee: match[3],
    heurePause: match[4],
    heureReprise: match[5],
    heureFin: match[6],
  };
};

const getHistoryEntries = () => {
  const raw = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  return raw.map((item) => {
    if (typeof item === "string") {
      const converted = parseLegacyHistoryString(item);
      return converted || { legacyText: item };
    }
    return item;
  });
};

const saveHistoryEntries = (entries) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
};

const createHistoryItem = (entry, index) => {
  const li = document.createElement("li");
  const container = document.createElement("div");
  container.className = "list-item-container";

  const supprimerBtn = document.createElement("button");
  supprimerBtn.textContent = "X";
  supprimerBtn.className = "delete-btn";
  supprimerBtn.onclick = function () {
    confirmAction(t("confirmDeleteEntry"), () => {
      const entries = getHistoryEntries();
      entries.splice(index, 1);
      saveHistoryEntries(entries);
      renderHistory();
      showSuccess(t("deletedEntry"));
    });
  };

  const legacyConverted = entry.legacyText
    ? parseLegacyHistoryString(entry.legacyText)
    : null;
  const text = legacyConverted
    ? toHistoryText(legacyConverted)
    : entry.legacyText || toHistoryText(entry);

  const textSpan = document.createElement("span");
  textSpan.className = "history-text";
  textSpan.textContent = text;

  container.appendChild(supprimerBtn);
  container.appendChild(textSpan);

  li.appendChild(container);
  historiqueElem.appendChild(li);
};

const renderHistory = () => {
  historiqueElem.innerHTML = "";
  const entries = getHistoryEntries();
  entries.forEach((entry, index) => createHistoryItem(entry, index));
};

const saveLastResult = (data) => {
  localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(data));
};

const refreshResultFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(LAST_RESULT_KEY) || "null");
  if (!data) {
    return;
  }
  resultatElem.innerHTML = t("resultTemplate")(
    data.heureFin,
    formatDuration(data.dureeTravail),
  );
};

const showV2Announcement = () => {
  if (localStorage.getItem(ANNOUNCEMENT_KEY) === "1") {
    return;
  }

  Notiflix.Report.success(t("v2Title"), t("v2Message"), t("v2Button"), {
    width: "560px",
    svgSize: "88px",
    borderRadius: "18px",
    titleColor: "#0f172a",
    messageColor: "#334155",
    titleMaxLength: 120,
    messageMaxLength: 1400,
    plainText: false,
    cssAnimationStyle: "zoom",
    buttonBackground: "#2563eb",
    backOverlayColor: "rgba(2, 6, 23, 0.68)",
    fontFamily: "Inter, sans-serif",
  });

  localStorage.setItem(ANNOUNCEMENT_KEY, "1");
};

// Vérifiez le mode stocké lors du chargement de la page
const storedTheme = localStorage.getItem(THEME_KEY);
if (storedTheme) {
  document.documentElement.setAttribute("data-theme", storedTheme);
}

themeButton.innerHTML =
  storedTheme === "dark"
    ? '<img src="img/mode-clair.png" alt="">'
    : '<img src="img/mode-sombre.png" alt="">';

updateThemeButtonUI();

// Ajout du bouton de basculement du mode sombre
themeButton.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.removeAttribute("data-theme");
    themeButton.innerHTML = '<img src="img/mode-sombre.png" alt="">';
    localStorage.removeItem(THEME_KEY);
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeButton.innerHTML = '<img src="img/mode-clair.png" alt="">';
    localStorage.setItem(THEME_KEY, "dark");
  }

  updateThemeButtonUI();
});

languageButton.addEventListener("click", () => {
  currentLanguage = currentLanguage === "fr" ? "en" : "fr";
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  applyTranslations();
});

// Gestionnaire d'événements pour le bouton de calcul
document.getElementById("calculButton").addEventListener("click", () => {
  const heureArrivee = heureArriveeElem.value;
  const heurePause = heurePauseElem.value;
  const heureReprise = heureRepriseElem.value;
  const dureeTravail = dureeTravailElem.value;

  const [hours, minutes] = dureeTravail.split(":");
  const dureeTravailMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);

  if (
    !heureArrivee ||
    !heurePause ||
    !heureReprise ||
    dureeTravailMinutes <= 0 ||
    dureeTravailMinutes > 12 * 60
  ) {
    showError(t("invalidInputs"));
    return;
  }

  const heureArriveeObj = convertToDateTime(heureArrivee);
  const heurePauseObj = convertToDateTime(heurePause);
  const heureRepriseObj = convertToDateTime(heureReprise);

  if (heureArriveeObj >= heurePauseObj || heurePauseObj >= heureRepriseObj) {
    showError(t("invalidSchedule"));
    return;
  }

  if (heureRepriseObj < heurePauseObj) {
    heureRepriseObj.setDate(heureRepriseObj.getDate() + 1);
  }

  const pauseDuration = (heureRepriseObj - heurePauseObj) / (1000 * 60);

  if (
    pauseDuration < 30 ||
    heureArriveeObj >= heurePauseObj ||
    heurePauseObj >= heureRepriseObj
  ) {
    showError(t("invalidBreak"));
    return;
  }

  const totalMinutes = (heurePauseObj - heureArriveeObj) / (1000 * 60);
  const heuresTravailRestant = dureeTravailMinutes - totalMinutes;

  const FinCalcul = new Date(
    heureRepriseObj.getTime() + heuresTravailRestant * 60 * 1000,
  );

  const heureFinFormat = FinCalcul.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const resultPayload = {
    heureFin: heureFinFormat,
    dureeTravail,
  };

  resultatElem.style.opacity = 0;
  setTimeout(() => {
    resultatElem.style.opacity = 1;
    resultatElem.innerHTML = t("resultTemplate")(
      heureFinFormat,
      formatDuration(dureeTravail),
    );
  }, 50);
  saveLastResult(resultPayload);

  const entry = {
    date: new Date().toLocaleDateString(),
    dureeTravail,
    heureArrivee,
    heurePause,
    heureReprise,
    heureFin: heureFinFormat,
  };

  const entries = getHistoryEntries();
  entries.push(entry);
  saveHistoryEntries(entries);
  renderHistory();
});

// Au chargement du document, récupération et affichage de l'historique depuis le localStorage
document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem(LAST_RESULT_KEY);
  resultatElem.textContent = "";
  applyTranslations();
  showV2Announcement();
});

// Gestionnaire d'événements pour le bouton d'effacement de l'historique
document.getElementById("clearHistoryButton").addEventListener("click", () => {
  const historiqueArr = getHistoryEntries();

  if (historiqueArr.length === 0) {
    showError(t("emptyHistory"));
    return;
  }

  confirmAction(t("confirmDeleteHistory"), () => {
    localStorage.removeItem(HISTORY_KEY);
    historiqueElem.innerHTML = "";
    showSuccess(t("deletedHistory"));
  });
});

const updateContactButtonUI = () => {
  contactButton.setAttribute(
    "aria-label",
    currentLanguage === "fr"
      ? "Contacter le développeur"
      : "Contact the developer",
  );

  contactButton.title =
    currentLanguage === "fr"
      ? "Signaler un bug ou proposer une amélioration"
      : "Report a bug or suggest an improvement";
};

contactButton.addEventListener("click", () => {
  const subject =
    currentLanguage === "fr"
      ? "Calculateur Horaire - Bug ou suggestion"
      : "Work Hours Calculator - Bug or suggestion";

  const body =
    currentLanguage === "fr"
      ? "Bonjour,\n\nJ'ai trouvé un bug / j'ai une idée d'amélioration :\n\n"
      : "Hello,\n\nI found a bug / I have an improvement idea:\n\n";

  window.location.href = `mailto:webmat.job@gmail.com?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
});
