// === INITIALISATION ===
let billet = document.querySelector(".argent-total");
let parsedBillet = parseFloat(billet.innerHTML);

let bpc = 5;
let bps = 0;
document.getElementById("bpc-text").innerHTML = bpc;
document.getElementById("bps-text").innerHTML = bps;

// === ÉLÉMENTS HTML ===
let billetImage = document.querySelector(".billet-image");
let billetPrix = document.querySelector(".billet-prix");
let billetNiveau = document.querySelector(".billet-niveau");
let billetIncrease = document.querySelector(".billet-increase");
let upgradeImg = document.querySelector(".upgrade-img");

let arbreNiveau = document.querySelector(".arbre-niveau");
let arbrePrix = document.querySelector(".arbre-prix");
let arbreIncrease = document.querySelector(".arbre-increase");

let banqueNiveau = document.querySelector(".banque-niveau");
let banquePrix = document.querySelector(".banque-prix");
let banqueIncrease = document.querySelector(".banque-increase");

// === DONNÉES ===
let arbreLevel = 0, arbreCost = 2000;
let banqueLevel = 0, banqueCost = 100000;

const billetsData = [
  { valeur: 10, image: "images/10monopoly.jpeg", prix: 100, bpc: 10 },
  { valeur: 20, image: "images/20monopoly.png", prix: 400, bpc: 20 },
  { valeur: 50, image: "images/50monopoly.png", prix: 1000, bpc: 50 },
  { valeur: 100, image: "images/100monopoly.jpeg", prix: 2000, bpc: 100 },
  { valeur: 500, image: "images/500monopoly.png", prix: 10000, bpc: 500 },
  { valeur: 1000, image: "images/1000monopoly.jpeg", prix: 20000, bpc: 1000 },
  { valeur: 5000, image: "images/5000monopoly.jpeg", prix: 100000, bpc: 5000 },
  { valeur: 10000, image: "images/10000monopoly.jpg", prix: 200000, bpc: 10000 },
  { valeur: 50000, image: "images/50000monopoly.jpg", prix: 1000000, bpc: 50000 }
];

let currentBilletIndex = 0;

// === BILLET ===
function updateBilletDisplay() {
  const billetData = billetsData[currentBilletIndex];
  billetPrix.innerHTML = billetData.prix + " €";
  upgradeImg.src = billetData.image;
  upgradeImg.alt = billetData.valeur + " EUR";
}

function incrementBillet() {
  parsedBillet += bpc;
  billet.innerHTML = Math.floor(parsedBillet);
  showFloatingText(`+${bpc} €💵`, "lightgreen");
  saveGame();
}

function buyBillet() {
  const billetData = billetsData[currentBilletIndex];
  if (parsedBillet >= billetData.prix) {
    parsedBillet -= billetData.prix;
    billet.innerHTML = Math.floor(parsedBillet);
    showFloatingText(`-${billetData.prix} €💵`, "red");

    bpc = billetData.bpc;
    billetIncrease.innerHTML = bpc;
    document.getElementById("bpc-text").innerHTML = bpc;

    billetNiveau.innerHTML = currentBilletIndex + 1;
    animateLevelUp(billetNiveau);

    billetImage.src = billetData.image;
    billetImage.alt = billetData.valeur + " EUR";

    if (currentBilletIndex < billetsData.length - 1) {
      currentBilletIndex++;
      updateBilletDisplay();
    }

    saveGame();
  } else {
    showError("❌ Pas assez d'argent !");
  }
}

// === ARBRE ===
function buyArbre() {
  if (parsedBillet >= arbreCost) {
    parsedBillet -= arbreCost;
    billet.innerHTML = Math.floor(parsedBillet);
    showFloatingText(`-${arbreCost} €💸`, "red");

    arbreLevel++;
    arbreNiveau.innerHTML = arbreLevel;
    arbreIncrease.innerHTML = arbreLevel * 100 + " billets";

    animateLevelUp(arbreNiveau);
    arbreCost *= 2;
    arbrePrix.innerHTML = arbreCost + " €";

    updateBPS();

    if (!window.arbreInterval) {
      window.arbreInterval = setInterval(() => {
        parsedBillet += arbreLevel * 100;
        billet.innerHTML = Math.floor(parsedBillet);
        saveGame();
      }, 10000);
    }

    saveGame();
  } else {
    showError("❌ Pas assez d'argent !");
  }
}

// === BANQUE ===
function buyBanque() {
  if (parsedBillet >= banqueCost) {
    parsedBillet -= banqueCost;
    billet.innerHTML = Math.floor(parsedBillet);
    showFloatingText(`-${banqueCost} €💰`, "red");

    banqueLevel++;
    banqueNiveau.innerHTML = banqueLevel;
    banqueIncrease.innerHTML = banqueLevel * 1000 + " billets";

    animateLevelUp(banqueNiveau);
    banqueCost *= 2;
    banquePrix.innerHTML = banqueCost + " €";

    updateBPS();

    if (!window.banqueInterval) {
      window.banqueInterval = setInterval(() => {
        parsedBillet += banqueLevel * 1000;
        billet.innerHTML = Math.floor(parsedBillet);
        saveGame();
      }, 5000);
    }

    saveGame();
  } else {
    showError("❌ Pas assez d'argent !");
  }
}

function updateBPS() {
  bps = arbreLevel * 100 + banqueLevel * 1000;
  document.getElementById("bps-text").innerHTML = bps;
}

// === VISUELS ===
function animateLevelUp(element) {
  element.classList.add("level-up-animate");
  setTimeout(() => element.classList.remove("level-up-animate"), 800);
}

function showFloatingText(text, color = "white") {
  const span = document.createElement("span");
  span.textContent = text;
  Object.assign(span.style, {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    color: color,
    fontSize: "24px",
    pointerEvents: "none",
    opacity: "1",
    transition: "all 1s ease-out",
    zIndex: 9999
  });
  document.body.appendChild(span);
  setTimeout(() => (span.style.top = "30%"), 50);
  setTimeout(() => span.remove(), 1000);
}

// === HOVER BILLET ===
const upgradeBtn = document.querySelector(".upgrade");
upgradeBtn.addEventListener("mouseenter", () => {
  const billetData = billetsData[currentBilletIndex];
  billetIncrease.innerHTML = billetData.bpc;
});
upgradeBtn.addEventListener("mouseleave", () => {
  billetIncrease.innerHTML = bpc;
});

// === ERREUR ===
function showError(message) {
  const errorBox = document.getElementById("error-message");
  errorBox.textContent = message;
  errorBox.classList.remove("error-hidden");
  errorBox.classList.add("error-visible");
  setTimeout(() => {
    errorBox.classList.remove("error-visible");
    errorBox.classList.add("error-hidden");
  }, 2000);
}

// === SAUVEGARDE ===
function saveGame() {
  localStorage.setItem("argent", parsedBillet);
  localStorage.setItem("bpc", bpc);
  localStorage.setItem("bps", bps);
  localStorage.setItem("currentBilletIndex", currentBilletIndex);
  localStorage.setItem("arbreLevel", arbreLevel);
  localStorage.setItem("arbreCost", arbreCost);
  localStorage.setItem("banqueLevel", banqueLevel);
  localStorage.setItem("banqueCost", banqueCost);
}

// === CHARGEMENT ===
function loadGame() {
  parsedBillet = parseFloat(localStorage.getItem("argent")) || 0;
  bpc = parseFloat(localStorage.getItem("bpc")) || 5;
  bps = parseFloat(localStorage.getItem("bps")) || 0;
  currentBilletIndex = parseInt(localStorage.getItem("currentBilletIndex")) || 0;
  arbreLevel = parseInt(localStorage.getItem("arbreLevel")) || 0;
  arbreCost = parseInt(localStorage.getItem("arbreCost")) || 2000;
  banqueLevel = parseInt(localStorage.getItem("banqueLevel")) || 0;
  banqueCost = parseInt(localStorage.getItem("banqueCost")) || 100000;

  billet.innerHTML = Math.floor(parsedBillet);
  billetIncrease.innerHTML = bpc;
  billetNiveau.innerHTML = currentBilletIndex;
  arbreNiveau.innerHTML = arbreLevel;
  arbrePrix.innerHTML = arbreCost + " €";
  arbreIncrease.innerHTML = arbreLevel * 100 + " billets";
  banqueNiveau.innerHTML = banqueLevel;
  banquePrix.innerHTML = banqueCost + " €";
  banqueIncrease.innerHTML = banqueLevel * 1000 + " billets";
  document.getElementById("bpc-text").innerHTML = bpc;
  document.getElementById("bps-text").innerHTML = bps;

  updateBilletDisplay();

  billetImage.src = billetsData[currentBilletIndex - 1]?.image || "images/5monopoly.jpeg";
  billetImage.alt = billetsData[currentBilletIndex - 1]?.valeur + " EUR" || "5 EUR";

  if (arbreLevel > 0) {
    window.arbreInterval = setInterval(() => {
      parsedBillet += arbreLevel * 100;
      billet.innerHTML = Math.floor(parsedBillet);
      saveGame();
    }, 10000);
  }

  if (banqueLevel > 0) {
    window.banqueInterval = setInterval(() => {
      parsedBillet += banqueLevel * 1000;
      billet.innerHTML = Math.floor(parsedBillet);
      saveGame();
    }, 5000);
  }
}

// === LANCEMENT ===
loadGame();
updateBilletDisplay();

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Tu es sûr(e) de vouloir tout réinitialiser ?")) {
    localStorage.clear();
    location.reload();
  }
});
