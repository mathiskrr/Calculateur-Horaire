// Eléments du DOM fréquemment utilisés
const heureArriveeElem = document.getElementById( "heureArrivee" );
const heurePauseElem = document.getElementById( "heurePause" );
const heureRepriseElem = document.getElementById( "heureReprise" );
const dureeTravailElem = document.getElementById( "dureeTravail" );
const resultatElem = document.getElementById( "resultat" );
const historiqueElem = document.getElementById( "historique" );
const themeButton = document.getElementById( "themeToggleButton" );
const languageButton = document.getElementById( "languageToggleButton" );
const versionElem = document.getElementById( "appVersion" );

const appVersion = "2.1";
const translations = {
  fr: {
    title: "Calculateur Horaire",
    subtitle: "Entrez vos horaires de la journée pour connaître instantanément votre heure de fin.",
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
    resultTemplate: ( heureFin, duree ) => `Vous devez finir à ${ heureFin } pour travailler ${ duree } au total.`,
    historyTemplate: ( date, duree, arr, pause, reprise, fin ) => `${ date } - Durée de travail : ${ duree }, Arrivée à ${ arr }, Pause à ${ pause }, Reprise à ${ reprise } => Fin de la journée à ${ fin }`,
    errorTitle: "Erreur",
    invalidInputs: "Veuillez remplir tous les champs correctement. Assurez-vous que la durée de travail est comprise entre 1 minute et 12 heures.",
    invalidSchedule: "Vérifiez vos horaires ! L'heure d'arrivée doit être antérieure à l'heure de pause et l'heure de pause doit être antérieure à l'heure de reprise.",
    invalidBreak: "Vérifiez vos horaires ! Assurez-vous que la durée de pause est d'au moins 30 minutes et que les horaires sont cohérents.",
    confirmTitle: "Êtes-vous sûr?",
    confirmText: "Vous ne pourrez pas revenir en arrière !",
    confirmYes: "Oui",
    confirmNo: "Non",
    deletedTitle: "Supprimé!",
    deletedEntry: "Votre enregistrement a été supprimé.",
    deletedHistory: "Votre historique a été supprimé.",
    emptyHistory: "Il n'y a pas d'historique à supprimer.",
    languageButton: "EN"
  },
  en: {
    title: "Work Hours Calculator",
    subtitle: "Enter your daily schedule to instantly get your end-of-day time.",
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
    resultTemplate: ( heureFin, duree ) => `You should finish at ${ heureFin } to work ${ duree } in total.`,
    historyTemplate: ( date, duree, arr, pause, reprise, fin ) => `${ date } - Work duration: ${ duree }, Start at ${ arr }, Break at ${ pause }, Resume at ${ reprise } => End time ${ fin }`,
    errorTitle: "Error",
    invalidInputs: "Please fill in all fields correctly. Make sure work duration is between 1 minute and 12 hours.",
    invalidSchedule: "Check your schedule! Start time must be before break time, and break time must be before resume time.",
    invalidBreak: "Check your schedule! Ensure break duration is at least 30 minutes and times are consistent.",
    confirmTitle: "Are you sure?",
    confirmText: "You won’t be able to undo this!",
    confirmYes: "Yes",
    confirmNo: "No",
    deletedTitle: "Deleted!",
    deletedEntry: "Your entry has been deleted.",
    deletedHistory: "Your history has been deleted.",
    emptyHistory: "There is no history to delete.",
    languageButton: "FR"
  }
};

const getLanguage = () => localStorage.getItem( "lang-mode" ) || "fr";
let currentLanguage = getLanguage();

const t = ( key ) => translations[ currentLanguage ][ key ];

const updateVersionText = () => {
  versionElem.textContent = `Version ${ appVersion } - ${ t( "versionDate" ) }`;
};

const applyTranslations = () => {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll( "[data-i18n]" ).forEach( ( element ) => {
    const key = element.getAttribute( "data-i18n" );
    element.textContent = t( key );
  } );
  languageButton.textContent = t( "languageButton" );
  updateVersionText();
};

// Fonction pour formater la durée en un format lisible
const formatDuration = ( duration ) => {
  const [ hours, minutes ] = duration.split( ":" );
  const minutesValue = parseInt( minutes, 10 );
  return `${ parseInt( hours, 10 ) } ${ t( "timeHours" ) } ${ minutesValue > 0 ? minutesValue + " " + t( "timeMinutes" ) : "" }`.trim();
};

// Fonction utilitaire pour convertir une heure en objet Date
const convertToDateTime = ( heureStr ) => {
  const currentDate = new Date();
  const [ hour, minute ] = heureStr.split( ":" );
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    hour,
    minute
  );
};

// Vérifiez le mode stocké lors du chargement de la page
const storedTheme = localStorage.getItem( "theme-mode" );
if ( storedTheme ) {
  document.documentElement.setAttribute( "data-theme", storedTheme );
}

// Ajout du bouton de basculement du mode sombre
themeButton.innerHTML = storedTheme === "dark" ? '<img src="img/mode-clair.png" alt="">' : '<img src="img/mode-sombre.png" alt="">';

themeButton.addEventListener( "click", () => {
  if ( document.documentElement.getAttribute( "data-theme" ) === "dark" ) {
    document.documentElement.removeAttribute( "data-theme" );
    themeButton.innerHTML = '<img src="img/mode-sombre.png" alt="">';
    localStorage.removeItem( "theme-mode" );
  } else {
    document.documentElement.setAttribute( "data-theme", "dark" );
    themeButton.innerHTML = '<img src="img/mode-clair.png" alt="">';
    localStorage.setItem( "theme-mode", "dark" );
  }
} );

languageButton.addEventListener( "click", () => {
  currentLanguage = currentLanguage === "fr" ? "en" : "fr";
  localStorage.setItem( "lang-mode", currentLanguage );
  applyTranslations();
} );

// Fonction pour ajouter une entrée à l'historique avec un bouton de suppression
function ajouterEntreeHistorique ( texte ) {
  const li = document.createElement( "li" );
  const container = document.createElement( "div" );
  container.className = "list-item-container";

  const supprimerBtn = document.createElement( "button" );
  supprimerBtn.textContent = "X";
  supprimerBtn.className = "delete-btn";
  supprimerBtn.onclick = function () {
    Swal.fire( {
      title: t( "confirmTitle" ),
      text: t( "confirmText" ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t( "confirmYes" ),
      cancelButtonText: t( "confirmNo" ),
    } ).then( ( result ) => {
      if ( result.isConfirmed ) {
        li.remove();

        const historiqueArr =
          JSON.parse( localStorage.getItem( "historiqueArr" ) ) || [];
        const index = historiqueArr.indexOf( texte );
        if ( index > -1 ) {
          historiqueArr.splice( index, 1 );
        }
        localStorage.setItem( "historiqueArr", JSON.stringify( historiqueArr ) );

        Swal.fire( t( "deletedTitle" ), t( "deletedEntry" ), "success" );
      }
    } );
  };

  container.appendChild( supprimerBtn );
  container.appendChild( document.createTextNode( texte ) );

  li.appendChild( container );
  historiqueElem.appendChild( li );
}

// Gestionnaire d'événements pour le bouton de calcul
document.getElementById( "calculButton" ).addEventListener( "click", () => {
  const heureArrivee = heureArriveeElem.value;
  const heurePause = heurePauseElem.value;
  const heureReprise = heureRepriseElem.value;
  const dureeTravail = dureeTravailElem.value;

  const [ hours, minutes ] = dureeTravail.split( ":" );
  const dureeTravailMinutes = parseInt( hours, 10 ) * 60 + parseInt( minutes, 10 );

  if (
    !heureArrivee ||
    !heurePause ||
    !heureReprise ||
    dureeTravailMinutes <= 0 ||
    dureeTravailMinutes > 12 * 60
  ) {
    Swal.fire( {
      icon: "error",
      title: t( "errorTitle" ),
      text: t( "invalidInputs" ),
    } );
    return;
  }

  const heureArriveeObj = convertToDateTime( heureArrivee );
  const heurePauseObj = convertToDateTime( heurePause );
  const heureRepriseObj = convertToDateTime( heureReprise );

  if ( heureArriveeObj >= heurePauseObj || heurePauseObj >= heureRepriseObj ) {
    Swal.fire( {
      icon: "error",
      title: t( "errorTitle" ),
      text: t( "invalidSchedule" ),
    } );
    return;
  }

  if ( heureRepriseObj < heurePauseObj ) {
    heureRepriseObj.setDate( heureRepriseObj.getDate() + 1 );
  }

  const pauseDuration = ( heureRepriseObj - heurePauseObj ) / ( 1000 * 60 );

  if (
    pauseDuration < 30 ||
    heureArriveeObj >= heurePauseObj ||
    heurePauseObj >= heureRepriseObj
  ) {
    Swal.fire( {
      icon: "error",
      title: t( "errorTitle" ),
      text: t( "invalidBreak" ),
    } );
    return;
  }

  const totalMinutes = ( heurePauseObj - heureArriveeObj ) / ( 1000 * 60 );
  const heuresTravailRestant = dureeTravailMinutes - totalMinutes;

  const FinCalcul = new Date(
    heureRepriseObj.getTime() + heuresTravailRestant * 60 * 1000
  );

  const heureFinFormat = FinCalcul.toLocaleTimeString( [], {
    hour: "2-digit",
    minute: "2-digit",
  } );

  resultatElem.style.opacity = 0;
  setTimeout( () => {
    resultatElem.style.opacity = 1;
    resultatElem.innerHTML = t( "resultTemplate" )( heureFinFormat, formatDuration( dureeTravail ) );
  }, 50 );

  const formattedDate = new Date().toLocaleDateString();
  const texteHistorique = t( "historyTemplate" )(
    formattedDate,
    formatDuration( dureeTravail ),
    heureArrivee,
    heurePause,
    heureReprise,
    heureFinFormat
  );

  ajouterEntreeHistorique( texteHistorique );

  const historiqueArr = JSON.parse( localStorage.getItem( "historiqueArr" ) ) || [];
  historiqueArr.push( texteHistorique );
  localStorage.setItem( "historiqueArr", JSON.stringify( historiqueArr ) );
} );

// Au chargement du document, récupération et affichage de l'historique depuis le localStorage
document.addEventListener( "DOMContentLoaded", () => {
  applyTranslations();
  const historiqueArr = JSON.parse( localStorage.getItem( "historiqueArr" ) ) || [];
  historiqueArr.forEach( ajouterEntreeHistorique );
} );

// Gestionnaire d'événements pour le bouton d'effacement de l'historique
document.getElementById( "clearHistoryButton" ).addEventListener( "click", () => {
  const historiqueArr = JSON.parse( localStorage.getItem( "historiqueArr" ) ) || [];

  if ( historiqueArr.length === 0 ) {
    Swal.fire( {
      icon: "error",
      title: t( "errorTitle" ),
      text: t( "emptyHistory" ),
    } );
    return;
  }

  Swal.fire( {
    title: t( "confirmTitle" ),
    text: t( "confirmText" ),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: t( "confirmYes" ),
    cancelButtonText: t( "confirmNo" ),
  } ).then( ( result ) => {
    if ( result.isConfirmed ) {
      localStorage.removeItem( "historiqueArr" );

      while ( historiqueElem.firstChild ) {
        historiqueElem.removeChild( historiqueElem.firstChild );
      }

      Swal.fire( t( "deletedTitle" ), t( "deletedHistory" ), "success" );
    }
  } );
} );
