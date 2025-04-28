// Récupération des éléments
let billet = document.querySelector(".argent-total");
let parsedBillet = parseFloat(billet.innerHTML);

// Valeurs de base
let bpc = 5;
let bps = 0;
document.getElementById("bpc-text").innerHTML = bpc;
document.getElementById("bps-text").innerHTML = bps;

// HTML éléments billets
let billetImage = document.querySelector(".billet-image");
let billetPrix = document.querySelector(".billet-prix");
let billetNiveau = document.querySelector(".billet-niveau");
let billetIncrease = document.querySelector(".billet-increase");
let upgradeImg = document.querySelector(".upgrade-img");

// HTML éléments arbre
let arbreNiveau = document.querySelector(".arbre-niveau");  //idem
let arbrePrix = document.querySelector(".arbre-prix");
let arbreIncrease = document.querySelector(".arbre-increase");

// HTML éléments banque
let banqueNiveau = document.querySelector(".banque-niveau"); //affichage
let banquePrix = document.querySelector(".banque-prix");
let banqueIncrease = document.querySelector(".banque-increase");

// Données arbre
let arbreLevel = 0; //logique js
let arbreCost = 2000;

// Données banque
let banqueLevel = 0;  //idem
let banqueCost = 100000;

// Tableau des billets
const billetsData = [
  { valeur: 10, image: "images/10monopoly.webp", prix: 100, bpc: 10 },
  { valeur: 20, image: "images/20monopoly.webp", prix: 400, bpc: 20 },
  { valeur: 50, image: "images/50monopoly.webp", prix: 1000, bpc: 50 },
  { valeur: 100, image: "images/100monopoly.webp", prix: 2000, bpc: 100 },
  { valeur: 500, image: "images/500monopoly.webp", prix: 10000, bpc: 500 },
  { valeur: 1000, image: "images/1000monopoly.webp", prix: 20000, bpc: 1000, nom: "Malo" },
  { valeur: 5000, image: "images/5000monopoly.webp", prix: 100000, bpc: 5000, nom: "Valentin" },
  { valeur: 10000, image: "images/10000monopoly.webp", prix: 200000, bpc: 10000, nom: "Kina" },
  { valeur: 50000, image: "images/50000monopoly.webp", prix: 1000000, bpc: 50000, nom: "Arsène" }
];

let currentBilletIndex = 0;

// Mise à jour visuelle billet à acheter
function updateBilletDisplay() {
  const billetData = billetsData[currentBilletIndex];
  billetPrix.innerHTML = billetData.prix + " €";
  upgradeImg.src = billetData.image;
  upgradeImg.alt = billetData.valeur + " EUR";
}

// Clic sur le billet
function incrementBillet() {
  parsedBillet += bpc;
  billet.innerHTML = Math.floor(parsedBillet);
  showFloatingText(`+${bpc} €💵`, "lightgreen");
  saveGame();
}

// Acheter un nouveau billet
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
    billetImage.src = billetData.image;
    billetImage.alt = billetData.valeur + " EUR";

    if (currentBilletIndex < billetsData.length - 1) {
      currentBilletIndex++;
      updateBilletDisplay();
    } else {
      document.querySelector(".upgrade").onclick = null;
    }

    saveGame();
  } else {
    showError("❌ Pas assez d'argent !");
  }
}

// Acheter un arbre
function buyArbre() {
  if (parsedBillet >= arbreCost) {
    parsedBillet -= arbreCost;
    billet.innerHTML = Math.floor(parsedBillet);
    showFloatingText(`-${arbreCost} €💸`, "red");

    arbreLevel++;
    arbreNiveau.innerHTML = arbreLevel;

    bps += 100;
    document.getElementById("bps-text").innerHTML = bps;

    arbreCost *= 2;
    arbrePrix.innerHTML = arbreCost + " €";

    if (!window.arbreInterval) {
      window.arbreInterval = setInterval(() => {
        parsedBillet += bps;
        billet.innerHTML = Math.floor(parsedBillet);
        saveGame();
      }, 10000);
    }

    saveGame();
  } else {
    showError("❌ Pas assez d'argent !");
  }
}

// Acheter une banque
function buyBanque() {
  if (parsedBillet >= banqueCost) {
    parsedBillet -= banqueCost;
    billet.innerHTML = Math.floor(parsedBillet);
    showFloatingText(`-${banqueCost} €💰`, "red");

    banqueLevel++;
    banqueNiveau.innerHTML = banqueLevel;

    bps += 1000;
    document.getElementById("bps-text").innerHTML = bps;

    banqueCost *= 2;
    banquePrix.innerHTML = banqueCost + " €";

    if (!window.banqueInterval) {
      window.banqueInterval = setInterval(() => {
        parsedBillet += 1000 * banqueLevel;
        billet.innerHTML = Math.floor(parsedBillet);
        saveGame();
      }, 5000);
    }

    saveGame();
  } else {
    showError("❌ Pas assez d'argent !");
  }
}

// Animation visuelle
function showFloatingText(text, color = "white") {
  const span = document.createElement("span");
  span.textContent = text;
  span.style.position = "absolute";
  span.style.left = "50%";
  span.style.top = "50%";
  span.style.transform = "translate(-50%, -50%)";
  span.style.color = color;
  span.style.fontSize = "24px";
  span.style.pointerEvents = "none";
  span.style.opacity = "1";
  span.style.transition = "all 1s ease-out";
  document.body.appendChild(span);

  setTimeout(() => {
    span.style.top = "30%";
    span.style.opacity = "0";
  }, 50);

  setTimeout(() => {
    span.remove();
  }, 1000);
}

// Hover sur le bouton upgrade
const upgradeBtn = document.querySelector(".upgrade");
upgradeBtn.addEventListener("mouseenter", () => {
  const billetData = billetsData[currentBilletIndex];
  billetIncrease.innerHTML = billetData.bpc;
});
upgradeBtn.addEventListener("mouseleave", () => {
  billetIncrease.innerHTML = bpc;
});

// Erreur affichage
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

// Sauvegarde
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

// Chargement
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
  document.getElementById("bpc-text").innerHTML = bpc;
  billetIncrease.innerHTML = bpc;
  billetNiveau.innerHTML = currentBilletIndex;
  arbreNiveau.innerHTML = arbreLevel;
  arbrePrix.innerHTML = arbreCost + " €";
  banqueNiveau.innerHTML = banqueLevel;
  banquePrix.innerHTML = banqueCost + " €";
  document.getElementById("bps-text").innerHTML = bps;

  updateBilletDisplay();

  billetImage.src = billetsData[currentBilletIndex - 1]?.image || "images/5monopoly.webp";
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

// Démarrage
loadGame();
updateBilletDisplay();

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Tu es sûr(e) de vouloir tout réinitialiser ?")) {
    localStorage.clear();
    location.reload();
  }
});
