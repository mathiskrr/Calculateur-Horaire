// Lorsqu'on clique sur le bouton de calcul
document.getElementById("calculButton").addEventListener("click", function () {
  // Récupération des valeurs des champs
  const heureArrivee = document.getElementById("heureArrivee").value;
  const heurePause = document.getElementById("heurePause").value;
  const heureReprise = document.getElementById("heureReprise").value;
  const dureeTravail = parseFloat(
    document.getElementById("dureeTravail").value
  );

  // Vérification des champs (s'ils sont remplis correctement et la durée de travail est entre 1 et 12 heures)
  if (
    heureArrivee === "" ||
    heurePause === "" ||
    heureReprise === "" ||
    isNaN(dureeTravail) ||
    dureeTravail <= 0 ||
    dureeTravail > 12
  ) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Veuillez remplir tous les champs correctement. Assurez-vous que la durée de travail est comprise entre 1 et 12 heures.",
    });
    return;
  }

  // Vérification des champs (s'ils sont remplis avant de calculer l'heure de fin)
  if (
    heureArrivee === "" ||
    heurePause === "" ||
    heureReprise === "" ||
    isNaN(dureeTravail)
  ) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Veuillez remplir tous les champs avant de calculer l'heure de fin.",
    });
    return;
  }

  // Obtention de la date courante
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // Formatage du jour et du mois pour avoir toujours deux chiffres
  const formattedDay = currentDay < 10 ? "0" + currentDay : currentDay;
  const formattedMonth = currentMonth < 10 ? "0" + currentMonth : currentMonth;

  // Formulation de la date au format "JJ/MM/AAAA"
  const formattedDate = `${formattedDay}/${formattedMonth}/${currentYear}`;

  // Conversion des heures entrées en objets de type Date pour les manipuler
  const heureArriveeObj = new Date(
    currentYear,
    currentMonth - 1, // Correction : les mois vont de 0 à 11
    currentDay,
    heureArrivee.split(":")[0],
    heureArrivee.split(":")[1]
  );
  const heurePauseObj = new Date(
    currentYear,
    currentMonth - 1, // Correction
    currentDay,
    heurePause.split(":")[0],
    heurePause.split(":")[1]
  );
  const heureRepriseObj = new Date(
    currentYear,
    currentMonth - 1, // Correction
    currentDay,
    heureReprise.split(":")[0],
    heureReprise.split(":")[1]
  );

  // Calcul de la durée de la pause
  const pauseDuration = (heureRepriseObj - heurePauseObj) / (1000 * 60);

  // Vérification que la pause est d'au moins 30 minutes
  if (pauseDuration < 30) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "La durée de la pause doit être d'au moins 30 minutes.",
    });
    return;
  }

  // Vérification de la validité des horaires
  if (heureArriveeObj >= heurePauseObj || heurePauseObj >= heureRepriseObj) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Vérifiez vos horaires ! L'heure de pause doit être après l'heure d'arrivée et l'heure de reprise après l'heure de pause.",
    });
    return;
  }

  // Si l'heure de reprise est avant l'heure de pause (cas de pause après minuit), ajout d'un jour
  if (heureRepriseObj < heurePauseObj) {
    heureRepriseObj.setDate(heureRepriseObj.getDate() + 1);
  }

  // Calcul du temps travaillé avant la pause
  const difference = heurePauseObj - heureArriveeObj;
  const totalMinutes = difference / (1000 * 60);
  const heuresTravailRestant = dureeTravail - totalMinutes / 60;

  // Calcul de l'heure de fin en ajoutant le temps de travail restant à l'heure de reprise
  const FinCalcul = new Date(
    heureRepriseObj.getTime() + heuresTravailRestant * 60 * 60 * 1000
  );

  // Formatage de l'heure de fin
  const heureFinFormat = FinCalcul.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Affichage de l'heure de fin avec un effet d'opacité
  const resultatElem = document.getElementById("resultat");
  resultatElem.style.opacity = 0;
  setTimeout(() => {
    resultatElem.style.opacity = 1;
    resultatElem.innerHTML = `Vous devez finir à ${heureFinFormat} pour travailler ${dureeTravail} heures au total.`;
  }, 50);

  // Ajout du résultat à l'historique et sauvegarde dans le localStorage
  const li = document.createElement("li");
  const texteHistorique = `${formattedDate} - Durée de travail : ${dureeTravail}h, Arrivée à ${heureArrivee}, Pause à ${heurePause}, Reprise à ${heureReprise} => Fin à de la journée à ${heureFinFormat}`;
  li.textContent = texteHistorique;
  document.getElementById("historique").appendChild(li);

  // Sauvegarde dans le localStorage
  let historiqueArr = JSON.parse(localStorage.getItem("historiqueArr")) || [];
  historiqueArr.push(texteHistorique);
  localStorage.setItem("historiqueArr", JSON.stringify(historiqueArr));
});

// Au chargement du document, chargement de l'historique depuis le localStorage
document.addEventListener("DOMContentLoaded", function () {
  let historiqueArr = JSON.parse(localStorage.getItem("historiqueArr")) || [];
  historiqueArr.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    document.getElementById("historique").appendChild(li);
  });
});

// Lorsqu'on clique sur le bouton pour effacer l'historique
document
  .getElementById("clearHistoryButton")
  .addEventListener("click", function () {
    // Suppression de l'historique dans le localStorage
    localStorage.removeItem("historiqueArr");

    // Suppression de l'affichage de l'historique
    const ul = document.getElementById("historique");
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }

    // Affichage d'une alerte pour confirmer la suppression
    Swal.fire({
      icon: "success",
      title: "Historique supprimé",
      text: "Votre historique a été effacé.",
    });
  });
