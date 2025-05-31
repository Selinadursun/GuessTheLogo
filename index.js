// Elementen ophalen uit de HTML
// Deze gebruik je om het spel visueel en functioneel te besturen via JavaScript
const startScherm = document.getElementById("startScherm");
const spelScherm = document.getElementById("spelScherm");
const winScherm = document.getElementById("winScherm");
const gameOverScherm = document.getElementById("gameOverScherm");

const startKnop = document.getElementById("startKnop");
const herstartKnoppen = document.querySelectorAll(".herstartKnop");

const scoreVeld = document.getElementById("score");
const pogingenVeld = document.getElementById("pogingen");
const feedback = document.getElementById("feedback");
const gokInput = document.getElementById("gokInput");
const controleerKnop = document.getElementById("controleerKnop");
const logoAfbeelding = document.getElementById("logoAfbeelding");
const timerVeld = document.querySelector(".timer");
const muziek = document.getElementById("muziek"); 

//  Variabelen voor het spel
// Hierin houden we de voortgang en status van het spel bij
let logoLijst = ["nike", "shell", "lays", "levis", "instagram", "google", "starbucks", "volvo", "apple", "pepsi"];
let huidigeIndex = 0;
let juisteLogo = logoLijst[huidigeIndex];
let score = 0;
let aantalPogingen = 3;
let tijd = 10;
let timerInterval = null;

// Timerfunctie
// Tel af van 10 naar 0 en handel af als tijd op is
function startTimer() {
  tijd = 10;
  timerVeld.textContent = "Tijd: " + tijd + " seconden";
  clearInterval(timerInterval);

  timerInterval = setInterval(function () {
    tijd--;
    timerVeld.textContent = "Tijd: " + tijd + " seconden";

    if (tijd <= 0) {
      clearInterval(timerInterval);
      toonFeedback("Tijd is op!", "fout");
      aantalPogingen--;
      updateStatus();

      if (aantalPogingen > 0) {
        setTimeout(naarVolgendLogo, 2000);
      } else {
        eindigSpel();
      }
    }
  }, 1000);
}

//  Status bijwerken
// Update de score en resterende pogingen op het scherm
function updateStatus() {
  scoreVeld.textContent = "Score: " + score;
  pogingenVeld.textContent = "Pogingen over: " + aantalPogingen;
}

//  Toon feedbackbericht
// Laat tijdelijk een feedbackbericht zien met een bepaalde stijl
function toonFeedback(tekst, type) {
  feedback.textContent = tekst;
  feedback.className = "feedback " + type;
  setTimeout(() => {
    feedback.className = "feedback hidden";
  }, 3000);
}

//  Gok van de speler controleren
// Vergelijkt de ingevoerde waarde met het juiste logo
//--- bronnen: .toLowerCase() https://javascript.info/string en .trim() https://www.w3schools.com/jsref/jsref_trim_string.asp ---//
function controleerGok() {
  let gok = gokInput.value.trim().toLowerCase();

  if (gok === "") {
    toonFeedback("Je hebt nog niets ingevuld!", "leeg");
    return;
  }

  if (gok === juisteLogo.toLowerCase()) {
    toonFeedback("Goed gedaan!", "goed");
    score++;
    clearInterval(timerInterval);
    updateStatus();
    setTimeout(naarVolgendLogo, 1500);
  } else {
    toonFeedback("Fout! Probeer opnieuw.", "fout");
    aantalPogingen--;
    if (aantalPogingen < 0) aantalPogingen = 0;
    updateStatus();
    gokInput.value = "";
    

    if (aantalPogingen === 0) {
      eindigSpel();
    } else {
      clearInterval(timerInterval);
      startTimer();
    }
  }
}

//  Toon het volgende logo
// Gaat naar het volgende item in de lijst of eindigt het spel als alles geraden is
function naarVolgendLogo() {
  huidigeIndex++;

  if (huidigeIndex >= logoLijst.length) {
    toonScherm(winScherm);
    return;
  }

  juisteLogo = logoLijst[huidigeIndex];
  logoAfbeelding.src = "./images/" + juisteLogo + ".jpeg";
  gokInput.value = "";
  feedback.className = "feedback hidden";
  startTimer();
}

//  Spel beëindigen als pogingen op zijn
function eindigSpel() {
  toonFeedback("Spel afgelopen!", "einde");
  gokInput.disabled = true;
  controleerKnop.disabled = true;
  setTimeout(() => {
    toonScherm(gameOverScherm);
  }, 1000);
}

//  Schermen wisselen
// Verbergt alle schermen en toont alleen het gevraagde scherm
function toonScherm(scherm) {
  startScherm.classList.add("hidden");
  spelScherm.classList.add("hidden");
  winScherm.classList.add("hidden");
  gameOverScherm.classList.add("hidden");

  scherm.classList.remove("hidden");
  clearInterval(timerInterval);

  // Eventlisteners koppelen aan exitknoppen
  if (scherm === winScherm) {
    const exitWinKnop = document.getElementById("exitWinKnop");
    if (exitWinKnop) {
      exitWinKnop.addEventListener("click", gaNaarStart);
    }
  }

  if (scherm === gameOverScherm) {
    const exitGameOverKnop = document.getElementById("exitGameOverKnop");
    if (exitGameOverKnop) {
      exitGameOverKnop.addEventListener("click", gaNaarStart);
    }
  }
}

//  Spel starten of opnieuw starten
// Zet alle waarden terug naar begin en start het spel
//-- audio met behulp van: https://www.geeksforgeeks.org/how-to-play-audio-in-javascript/ --//
function startSpel() {
  huidigeIndex = 0;
  score = 0;
  aantalPogingen = 3;
  juisteLogo = logoLijst[huidigeIndex];
  gokInput.disabled = false;
  controleerKnop.disabled = false;
  logoAfbeelding.src = "./images/" + juisteLogo + ".jpeg";
  gokInput.value = "";
  feedback.className = "feedback hidden";
  updateStatus();
  toonScherm(spelScherm);
  startTimer();

  // Muziek starten (pas na eerste interactie toegestaan door browsers)
  if (muziek.paused) {
    muziek.play().catch(function (error) {
    });
  }
}

//  Ga terug naar het startscherm
function gaNaarStart() {
  clearInterval(timerInterval);
  feedback.className = "feedback hidden";
  gokInput.value = "";
  toonScherm(startScherm);
}

// Eventlisteners koppelen aan knoppen
startKnop.addEventListener("click", startSpel);
herstartKnoppen.forEach(knop => knop.addEventListener("click", startSpel));
controleerKnop.addEventListener("click", controleerGok);
