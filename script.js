document.getElementById("calculButton").addEventListener("click", function () {
  const heureArrivee = document.getElementById("heureArrivee").value;
  const heurePause = document.getElementById("heurePause").value;
  const heureReprise = document.getElementById("heureReprise").value;
  const dureeTravail = parseFloat(
    document.getElementById("dureeTravail").value
  );

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

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

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

  const pauseDuration = (heureRepriseObj - heurePauseObj) / (1000 * 60);
  if (pauseDuration < 30) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "La durée de la pause doit être d'au moins 30 minutes.",
    });
    return;
  }

  if (heureArriveeObj >= heurePauseObj || heurePauseObj >= heureRepriseObj) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: "Vérifiez vos horaires ! L'heure de pause doit être après l'heure d'arrivée et l'heure de reprise après l'heure de pause.",
    });
    return;
  }

  if (heureRepriseObj < heurePauseObj) {
    heureRepriseObj.setDate(heureRepriseObj.getDate() + 1);
  }

  const difference = heurePauseObj - heureArriveeObj;
  const totalMinutes = difference / (1000 * 60);
  const heuresTravailRestant = dureeTravail - totalMinutes / 60;

  const FinCalcul = new Date(
    heureRepriseObj.getTime() + heuresTravailRestant * 60 * 60 * 1000
  );

  const heureFinFormat = FinCalcul.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const resultatElem = document.getElementById("resultat");
  resultatElem.style.opacity = 0;
  setTimeout(() => {
    resultatElem.style.opacity = 1;
    resultatElem.innerHTML = `Vous devez finir à ${heureFinFormat} pour travailler ${dureeTravail} heures au total.`;
  }, 50);

  // Ajouter le résultat à l'historique et au localStorage
  const li = document.createElement("li");
  const texteHistorique = `Durée de travail : ${dureeTravail}h, Arrivée à ${heureArrivee}, Pause à ${heurePause}, Reprise à ${heureReprise} => Fin à ${heureFinFormat}`;
  li.textContent = texteHistorique;
  document.getElementById("historique").appendChild(li);

  // Sauvegarder l'historique dans localStorage
  let historiqueArr = JSON.parse(localStorage.getItem("historiqueArr")) || [];
  historiqueArr.push(texteHistorique);
  localStorage.setItem("historiqueArr", JSON.stringify(historiqueArr));
});

document.addEventListener("DOMContentLoaded", function () {
  // Charger l'historique depuis localStorage
  let historiqueArr = JSON.parse(localStorage.getItem("historiqueArr")) || [];
  historiqueArr.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    document.getElementById("historique").appendChild(li);
  });
});

document
  .getElementById("clearHistoryButton")
  .addEventListener("click", function () {
    // Vider le localStorage pour l'historique
    localStorage.removeItem("historiqueArr");

    // Vider l'affichage de l'historique
    const ul = document.getElementById("historique");
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }

    // Optionnel : Affichez une alerte pour confirmer la suppression
    Swal.fire({
      icon: "success",
      title: "Historique supprimé",
      text: "Votre historique a été effacé.",
    });
  });
