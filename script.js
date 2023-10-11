document.getElementById("calculButton").addEventListener("click", function () {
  // Cette ligne ajoute un événement "click" à l'élément HTML avec l'ID "calculButton" et
  // associe une fonction qui sera exécutée lorsque le bouton est cliqué.

  const heureArrivee = document.getElementById("heureArrivee").value;
  const heurePause = document.getElementById("heurePause").value;
  const heureReprise = document.getElementById("heureReprise").value;
  // Ces lignes extraient les valeurs entrées dans les champs de texte "heureArrivee", "heurePause" et "heureReprise" et les stockent dans des variables.

  // Vérification si l'un des champs est vide
  if (heureArrivee === "" || heurePause === "" || heureReprise === "") {
    // Afficher un message d'erreur
    alert("Veuillez remplir tous les champs avant de calculer l'heure de fin.");
    return; // Arrêter l'exécution de la fonction
  }

  const currentDate = new Date(); // Obtient la date et l'heure actuelles.
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  // Ces lignes extraient l'année, le mois et le jour actuels à partir de la date actuelle.

  const heureArriveeObj = new Date(
    currentYear,
    currentMonth,
    currentDay,
    heureArrivee.split(":")[0],
    heureArrivee.split(":")[1]
  );
  const heurePauseObj = new Date(
    currentYear,
    currentMonth,
    currentDay,
    heurePause.split(":")[0],
    heurePause.split(":")[1]
  );
  const heureRepriseObj = new Date(
    currentYear,
    currentMonth,
    currentDay,
    heureReprise.split(":")[0],
    heureReprise.split(":")[1]
  );
  // Ces lignes créent des objets Date en utilisant les valeurs d'année, de mois et de jour actuelles
  // et les heures et les minutes extraites des champs de texte "heureArrivee", "heurePause" et "heureReprise".

  // Vérifier si l'heure de reprise est avant l'heure de pause (changement de jour)
  if (heureRepriseObj < heurePauseObj) {
    heureRepriseObj.setDate(heureRepriseObj.getDate() + 1);
    // Si l'heure de reprise est antérieure à l'heure de pause, cela signifie que le travail traverse
    // minuit et qu'il y a un changement de jour. Dans ce cas, nous ajoutons un jour à l'heure de reprise.
  }

  const difference = heurePauseObj - heureArriveeObj;
  const totalMinutes = difference / (1000 * 60);
  const heuresTravailRestant = 8 - totalMinutes / 60;
  // Ces lignes calculent la différence de temps, le total des minutes travaillées
  // et les heures de travail restantes nécessaires pour atteindre 8 heures.

  // Ajout des heures de travail restantes à l'heure de reprise
  const FinCalcul = new Date(
    heureRepriseObj.getTime() + heuresTravailRestant * 60 * 60 * 1000
  );
  // Cette ligne ajoute les heures de travail restantes (en millisecondes) à l'heure de reprise pour obtenir l'heure de fin.

  const heureFinFormat = FinCalcul.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  // Cette ligne formate l'heure de fin au format "hh:mm" (heures et minutes).

  document.getElementById(
    "resultat"
  ).innerHTML = `Vous devez finir à ${heureFinFormat} pour travailler 8 heures au total.`;
  // Cette ligne affiche le résultat dans la page en remplaçant le contenu de l'élément avec l'ID "resultat".
});
