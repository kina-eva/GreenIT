// === INIT ===
const billet = document.querySelector(".argent-total");
const billetImage = document.querySelector(".billet-image");
const billetPrix = document.querySelector(".billet-prix");
const billetNiveau = document.querySelector(".billet-niveau");
const billetIncrease = document.querySelector(".billet-increase");

const arbrePrix = document.querySelector(".arbre-prix");
const arbreNiveau = document.querySelector(".arbre-niveau");

const banquePrix = document.querySelector(".banque-prix");
const banqueNiveau = document.querySelector(".banque-niveau");

let parsedBillet = 0;
let bpc = 5;
let bps = 0;
let arbreLevel = 0, arbreCost = 2000;
let banqueLevel = 0, banqueCost = 100000;
let currentBilletIndex = 0;

const billetsData = [
  { valeur: 10, image: "images/10monopoly.jpeg", prix: 100, bpc: 10 },
  { valeur: 20, image: "images/20monopoly.png", prix: 400, bpc: 20 },
  { valeur: 50, image: "images/50monopoly.png", prix: 1000, bpc: 50 },
  { valeur: 100, image: "images/100monopoly.jpeg", prix: 2000, bpc: 100 },
  { valeur: 500, image: "images/500monopoly.png", prix: 10000, bpc: 500 }
];

// === FUNCTIONS ===
function incrementBillet() {
  parsedBillet += bpc;
  updateDisplay();
}

function buyBillet() {
  const data = billetsData[currentBilletIndex];
  if (parsedBillet >= data.prix) {
    parsedBillet -= data.prix;
    bpc = data.bpc;
    billetImage.src = data.image;
    if (currentBilletIndex < billetsData.length - 1) currentBilletIndex++;
    updateDisplay();
  } else {
    showError("Pas assez d'argent !");
  }
}

function buyArbre() {
  if (parsedBillet >= arbreCost) {
    parsedBillet -= arbreCost;
    arbreLevel++;
    arbreCost *= 2;
    startArbreInterval();
    updateDisplay();
  } else {
    showError("Pas assez d'argent !");
  }
}

function buyBanque() {
  if (parsedBillet >= banqueCost) {
    parsedBillet -= banqueCost;
    banqueLevel++;
    banqueCost *= 2;
    startBanqueInterval();
    updateDisplay();
  } else {
    showError("Pas assez d'argent !");
  }
}

function startArbreInterval() {
  if (!window.arbreInterval) {
    window.arbreInterval = setInterval(() => {
      parsedBillet += arbreLevel * 100;
      updateDisplay();
    }, 10000);
  }
}

function startBanqueInterval() {
  if (!window.banqueInterval) {
    window.banqueInterval = setInterval(() => {
      parsedBillet += banqueLevel * 1000;
      updateDisplay();
    }, 5000);
  }
}

function updateBPS() {
  bps = arbreLevel * 100 + banqueLevel * 1000;
}

function updateDisplay() {
  billet.textContent = Math.floor(parsedBillet);
  billetPrix.textContent = billetsData[currentBilletIndex]?.prix + " €";
  billetIncrease.textContent = bpc;
  billetNiveau.textContent = currentBilletIndex;
  arbrePrix.textContent = arbreCost + " €";
  arbreNiveau.textContent = arbreLevel;
  banquePrix.textContent = banqueCost + " €";
  banqueNiveau.textContent = banqueLevel;
  updateBPS();
  document.getElementById("bpc-text").textContent = bpc;
  document.getElementById("bps-text").textContent = bps;
}

// === SAVE / LOAD ===
function saveGameLocally() {
  localStorage.setItem("game", JSON.stringify({
    argent: parsedBillet,
    bpc,
    bps,
    currentBilletIndex,
    arbreLevel,
    banqueLevel,
    arbreCost,
    banqueCost
  }));
}

function loadGameLocally() {
  const data = JSON.parse(localStorage.getItem("game"));
  if (data) {
    parsedBillet = data.argent;
    bpc = data.bpc;
    bps = data.bps;
    currentBilletIndex = data.currentBilletIndex;
    arbreLevel = data.arbreLevel;
    banqueLevel = data.banqueLevel;
    arbreCost = data.arbreCost;
    banqueCost = data.banqueCost;
    updateDisplay();
    startAutoProduction();
  }
}

function saveGameToServer() {
  return fetch('save_stats.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      argent: parsedBillet,
      bpc,
      bps,
      currentBilletIndex,
      arbreLevel,
      banqueLevel,
      arbreCost,
      banqueCost
    })
  });
}

function loadGameFromServer() {
  fetch('load_stats.php')
    .then(response => response.json())
    .then(data => {
      parsedBillet = data.argent;
      bpc = data.bpc;
      bps = data.bps;
      currentBilletIndex = data.currentBilletIndex;
      arbreLevel = data.arbreLevel;
      banqueLevel = data.banqueLevel;
      arbreCost = data.arbreCost;
      banqueCost = data.banqueCost;
      updateDisplay();
      startAutoProduction();
    })
    .catch(() => loadGameLocally());
}

function startAutoProduction() {
  if (arbreLevel > 0) startArbreInterval();
  if (banqueLevel > 0) startBanqueInterval();
}

function saveGameManually() {
  saveGameLocally();
  if (isLoggedIn) {
    saveGameToServer()
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showMessage("✅ Partie sauvegardée !");
        } else {
          showError("❌ Erreur lors de la sauvegarde serveur !");
        }
      })
      .catch(() => {
        showError("❌ Erreur réseau serveur !");
      });
  } else {
    showMessage("✅ Partie sauvegardée localement !");
  }
}

// === MESSAGES ===
function showMessage(msg) {
  const saveMessage = document.getElementById("save-message");
  saveMessage.textContent = msg;
  saveMessage.classList.add("show");
  setTimeout(() => saveMessage.classList.remove("show"), 3000);
}

function showError(msg) {
  const errorBox = document.getElementById("error-message");
  errorBox.textContent = msg;
  errorBox.classList.add("error-visible");
  setTimeout(() => errorBox.classList.remove("error-visible"), 2000);
}

// === RESET ===
document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Réinitialiser la partie ?")) {
    localStorage.clear();
    if (isLoggedIn) fetch('reset_stats.php', { method: 'POST' });
    location.reload();
  }
});

// === DECONNEXION ===
if (isLoggedIn) {
  document.getElementById("logout-btn").addEventListener("click", () => {
    fetch('logout.php')
      .then(() => {
        localStorage.clear();
        window.location.href = "index.php";
      });
  });
} else {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.style.display = "none";
}

// === LANCEMENT ===
if (isLoggedIn) {
  loadGameFromServer();
} else {
  loadGameLocally();
}

setInterval(saveGameManually, 30000);
document.getElementById("save-btn").addEventListener("click", saveGameManually);
