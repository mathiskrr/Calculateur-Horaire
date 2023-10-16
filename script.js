// Eléments du DOM fréquemment utilisés
const heureArriveeElem = document.getElementById("heureArrivee");
const heurePauseElem = document.getElementById("heurePause");
const heureRepriseElem = document.getElementById("heureReprise");
const dureeTravailElem = document.getElementById("dureeTravail"); // Ce sera maintenant une chaîne au format "HH:mm"
const resultatElem = document.getElementById("resultat");
const historiqueElem = document.getElementById("historique");

const appVersion = "1.0"; // Remplacez par la version actuelle de l'application

const versionElem = document.createElement("div");
versionElem.id = "appVersion";
versionElem.textContent = "Version " + appVersion + " - " + "Oct 2023";
document.body.appendChild(versionElem);

// Fonction pour formater la durée en un format lisible
const formatDuration = (duration) => {
  const [hours, minutes] = duration.split(":");
  return `${parseInt(hours, 10)} heure(s) ${
    parseInt(minutes, 10) > 0 ? parseInt(minutes, 10) + " minute(s)" : ""
  }`;
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
    minute
  );
};

// Vérifiez le mode stocké lors du chargement de la page
const storedTheme = localStorage.getItem("theme-mode");
if (storedTheme) {
  document.documentElement.setAttribute("data-theme", storedTheme);
}

// Ajout du bouton de basculement du mode sombre
const themeButton = document.createElement("button");
themeButton.id = "themeToggleButton";
themeButton.textContent = storedTheme === "dark" ? "Mode clair" : "Mode sombre";
document.body.appendChild(themeButton);

themeButton.addEventListener("click", () => {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.removeAttribute("data-theme");
    themeButton.textContent = "Mode sombre";
    localStorage.removeItem("theme-mode");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeButton.textContent = "Mode clair";
    localStorage.setItem("theme-mode", "dark");
  }
});

// Gestionnaire d'événements pour le bouton de calcul
document.getElementById("calculButton").addEventListener("click", () => {
  // Récupération des valeurs des champs du formulaire
  const heureArrivee = heureArriveeElem.value;
  const heurePause = heurePauseElem.value;
  const heureReprise = heureRepriseElem.value;
  const dureeTravail = dureeTravailElem.value; // Ce sera maintenant une chaîne au format "HH:mm"

  // Conversion de la durée de travail en minutes totales
  const [hours, minutes] = dureeTravail.split(":");
  const dureeTravailMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);

  // Vérification de la validité des entrées
  if (
    !heureArrivee ||
    !heurePause ||
    !heureReprise ||
    dureeTravailMinutes <= 0 ||
    dureeTravailMinutes > 12 * 60
  ) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Veuillez remplir tous les champs correctement. Assurez-vous que la durée de travail est comprise entre 1 minute et 12 heures.",
    });
    return;
  }

  // Conversion des heures entrées en objets Date pour faciliter les opérations
  const heureArriveeObj = convertToDateTime(heureArrivee);
  const heurePauseObj = convertToDateTime(heurePause);
  const heureRepriseObj = convertToDateTime(heureReprise);

  // Vérification des horaires pour s'assurer de leur cohérence
  if (heureArriveeObj >= heurePauseObj || heurePauseObj >= heureRepriseObj) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Vérifiez vos horaires ! L'heure d'arrivée doit être antérieure à l'heure de pause et l'heure de pause doit être antérieure à l'heure de reprise.",
    });
    return;
  }

  // Si l'heure de reprise est avant l'heure de pause, cela signifie que la pause s'étend au-delà de minuit
  if (heureRepriseObj < heurePauseObj)
    heureRepriseObj.setDate(heureRepriseObj.getDate() + 1);

  // Calcul de la durée de la pause en minutes
  const pauseDuration = (heureRepriseObj - heurePauseObj) / (1000 * 60);

  // Vérifications supplémentaires sur la validité des horaires
  if (
    pauseDuration < 30 ||
    heureArriveeObj >= heurePauseObj ||
    heurePauseObj >= heureRepriseObj
  ) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Vérifiez vos horaires ! Assurez-vous que la durée de pause est d'au moins 30 minutes et que les horaires sont cohérents.",
    });
    return;
  }

  // Calcul du temps travaillé avant la pause
  const totalMinutes = (heurePauseObj - heureArriveeObj) / (1000 * 60);
  const heuresTravailRestant = dureeTravailMinutes - totalMinutes;

  // Calcul de l'heure de fin de travail
  const FinCalcul = new Date(
    heureRepriseObj.getTime() + heuresTravailRestant * 60 * 1000
  );

  // Formatage de l'heure de fin pour l'affichage
  const heureFinFormat = FinCalcul.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Mise à jour de l'élément de résultat avec un effet d'opacité pour attirer l'attention
  resultatElem.style.opacity = 0;
  setTimeout(() => {
    resultatElem.style.opacity = 1;
    resultatElem.innerHTML = `Vous devez finir à ${heureFinFormat} pour travailler ${formatDuration(
      dureeTravail
    )} au total.`; // Utilisation de la fonction de formatage ici
  }, 50);

  // Ajout du résultat à la liste de l'historique
  const formattedDate = new Date().toLocaleDateString();
  const texteHistorique = `${formattedDate} - Durée de travail : ${formatDuration(
    dureeTravail
  )}, Arrivée à ${heureArrivee}, Pause à ${heurePause}, Reprise à ${heureReprise} => Fin de la journée à ${heureFinFormat}`; // Utilisation de la fonction de formatage ici
  const li = document.createElement("li");
  li.textContent = texteHistorique;
  historiqueElem.appendChild(li);

  // Enregistrement du résultat dans le localStorage pour une persistance entre les sessions
  const historiqueArr = JSON.parse(localStorage.getItem("historiqueArr")) || [];
  historiqueArr.push(texteHistorique);
  localStorage.setItem("historiqueArr", JSON.stringify(historiqueArr));
});

// Au chargement du document, récupération et affichage de l'historique depuis le localStorage
document.addEventListener("DOMContentLoaded", () => {
  const historiqueArr = JSON.parse(localStorage.getItem("historiqueArr")) || [];
  historiqueArr.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    historiqueElem.appendChild(li);
  });
});

// Gestionnaire d'événements pour le bouton d'effacement de l'historique
document.getElementById("clearHistoryButton").addEventListener("click", () => {
  const historiqueArr = JSON.parse(localStorage.getItem("historiqueArr")) || [];

  // Si l'historique est vide
  if (historiqueArr.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Il n'y a pas d'historique à supprimer.",
    });
    return;
  }

  // Suppression de l'historique du localStorage
  localStorage.removeItem("historiqueArr");

  // Effacement de la liste d'historique à l'écran
  while (historiqueElem.firstChild) {
    historiqueElem.removeChild(historiqueElem.firstChild);
  }

  // Notification à l'utilisateur que l'historique a été effacé
  Swal.fire({
    icon: "success",
    title: "Historique supprimé",
    text: "Votre historique a été effacé.",
  });
});
