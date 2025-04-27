// === INITIALISATION ===
let billet = document.querySelector(".argent-total");
let parsedBillet = 0;

let bpc = 5;
let bps = 0;

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

// === AFFICHAGE ===
function updateBilletDisplay() {
  const billetData = billetsData[currentBilletIndex] || billetsData[0];
  billetPrix.innerHTML = billetData.prix + " €";
  upgradeImg.src = billetData.image;
  upgradeImg.alt = billetData.valeur + " EUR";
}

// === GESTION DU JEU ===
function incrementBillet() {
  parsedBillet += bpc;
  billet.innerHTML = Math.floor(parsedBillet);
  showFloatingText(`+${bpc} €💵`, "lightgreen");
  saveGameLocally();
}

function buyBillet() {
  const billetData = billetsData[currentBilletIndex];
  if (parsedBillet >= billetData.prix) {
    parsedBillet -= billetData.prix;
    billet.innerHTML = Math.floor(parsedBillet);
    showFloatingText(`-${billetData.prix} €💵`, "red");

    bpc = billetData.bpc;
    billetIncrease.innerHTML = bpc;
    billetNiveau.innerHTML = currentBilletIndex + 1;
    billetImage.src = billetData.image;
    billetImage.alt = billetData.valeur + " EUR";

    if (currentBilletIndex < billetsData.length - 1) {
      currentBilletIndex++;
      updateBilletDisplay();
    }

    document.getElementById("bpc-text").innerHTML = bpc;
    saveGameLocally();
  } else {
    showError("❌ Pas assez d'argent !");
  }
}

function buyArbre() {
  if (parsedBillet >= arbreCost) {
    parsedBillet -= arbreCost;
    billet.innerHTML = Math.floor(parsedBillet);
    arbreLevel++;
    arbreCost *= 2;

    arbreNiveau.innerHTML = arbreLevel;
    arbrePrix.innerHTML = arbreCost + " €";
    arbreIncrease.innerHTML = arbreLevel * 100 + " billets";

    updateBPS();
    if (!window.arbreInterval) {
      window.arbreInterval = setInterval(() => {
        parsedBillet += arbreLevel * 100;
        billet.innerHTML = Math.floor(parsedBillet);
        saveGameLocally();
      }, 10000);
    }

    saveGameLocally();
  } else {
    showError("❌ Pas assez d'argent !");
  }
}

function buyBanque() {
  if (parsedBillet >= banqueCost) {
    parsedBillet -= banqueCost;
    billet.innerHTML = Math.floor(parsedBillet);
    banqueLevel++;
    banqueCost *= 2;

    banqueNiveau.innerHTML = banqueLevel;
    banquePrix.innerHTML = banqueCost + " €";
    banqueIncrease.innerHTML = banqueLevel * 1000 + " billets";

    updateBPS();
    if (!window.banqueInterval) {
      window.banqueInterval = setInterval(() => {
        parsedBillet += banqueLevel * 1000;
        billet.innerHTML = Math.floor(parsedBillet);
        saveGameLocally();
      }, 5000);
    }

    saveGameLocally();
  } else {
    showError("❌ Pas assez d'argent !");
  }
}

function updateBPS() {
  bps = arbreLevel * 100 + banqueLevel * 1000;
  document.getElementById("bps-text").innerHTML = bps;
}

// === VISUEL ===
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

// === SAUVEGARDE LOCALE + SERVEUR ===
function saveGameLocally() {
  localStorage.setItem("argent", parsedBillet);
  localStorage.setItem("bpc", bpc);
  localStorage.setItem("bps", bps);
  localStorage.setItem("currentBilletIndex", currentBilletIndex);
  localStorage.setItem("arbreLevel", arbreLevel);
  localStorage.setItem("arbreCost", arbreCost);
  localStorage.setItem("banqueLevel", banqueLevel);
  localStorage.setItem("banqueCost", banqueCost);
}

function saveGameToServer() {
  return fetch('save_stats.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      argent: parsedBillet,
      bpc: bpc,
      bps: bps,
      currentBilletIndex: currentBilletIndex,
      arbreLevel: arbreLevel,
      banqueLevel: banqueLevel,
      arbreCost: arbreCost,
      banqueCost: banqueCost
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Sauvegarde serveur:", data);
    return data;
  })
  .catch(error => {
    console.error("Erreur sauvegarde serveur:", error);
    throw error;
  });
}

// === FONCTION DE SAUVEGARDE MANUELLE ===
function saveGameManually() {
  const saveBtn = document.getElementById("save-btn");
  const saveMessage = document.getElementById("save-message");
  
  // Désactiver le bouton pendant la sauvegarde
  saveBtn.disabled = true;
  saveBtn.textContent = "⏳ Sauvegarde...";
  
  // Sauvegarder localement et sur le serveur
  saveGameLocally();
  
  saveGameToServer()
    .then(response => {
      // Afficher le message de succès
      saveMessage.textContent = "✅ Partie sauvegardée !";
      saveMessage.classList.add("show");
      setTimeout(() => saveMessage.classList.remove("show"), 3000);
      
      // Réactiver le bouton
      saveBtn.disabled = false;
      saveBtn.textContent = "💾 Sauvegarder";
    })
    .catch(error => {
      // Afficher un message d'erreur
      saveMessage.textContent = "❌ Erreur de sauvegarde !";
      saveMessage.style.color = "red";
      saveMessage.classList.add("show");
      setTimeout(() => {
        saveMessage.classList.remove("show");
        saveMessage.style.color = "#28a745"; // Remettre la couleur d'origine
      }, 3000);
      
      // Réactiver le bouton
      saveBtn.disabled = false;
      saveBtn.textContent = "💾 Sauvegarder";
    });
}

// === CHARGEMENT ===
function loadGameFromServer() {
  fetch('load_stats.php')
  .then(response => response.json())
  .then(data => {
    if (data && !data.error) {
      parsedBillet = parseFloat(data.argent) || 0;
      bpc = parseFloat(data.bpc) || 5;
      bps = parseFloat(data.bps) || 0;
      currentBilletIndex = parseInt(data.currentBilletIndex) || 0;
      arbreLevel = parseInt(data.arbreLevel) || 0;
      banqueLevel = parseInt(data.banqueLevel) || 0;
      arbreCost = parseFloat(data.arbreCost) || 2000;
      banqueCost = parseFloat(data.banqueCost) || 100000;
      console.log("Données chargées du serveur:", data);
    } else {
      console.log("Aucune donnée sur le serveur ou erreur:", data);
      loadGameLocally(); // Si serveur indisponible, charger localStorage
    }
    applyGameData();
  })
  .catch(error => {
    console.error("Erreur chargement serveur:", error);
    loadGameLocally(); // Si serveur indisponible, charger localStorage
  });
}

function loadGameLocally() {
  parsedBillet = parseFloat(localStorage.getItem("argent")) || 0;
  bpc = parseFloat(localStorage.getItem("bpc")) || 5;
  bps = parseFloat(localStorage.getItem("bps")) || 0;
  currentBilletIndex = parseInt(localStorage.getItem("currentBilletIndex")) || 0;
  arbreLevel = parseInt(localStorage.getItem("arbreLevel")) || 0;
  arbreCost = parseFloat(localStorage.getItem("arbreCost")) || 2000;
  banqueLevel = parseInt(localStorage.getItem("banqueLevel")) || 0;
  banqueCost = parseFloat(localStorage.getItem("banqueCost")) || 100000;
  console.log("Données chargées du localStorage");
  applyGameData();
}

function applyGameData() {
  billet.innerHTML = Math.floor(parsedBillet);
  billetIncrease.innerHTML = bpc;
  billetNiveau.innerHTML = currentBilletIndex + 1;
  arbreNiveau.innerHTML = arbreLevel;
  arbrePrix.innerHTML = arbreCost + " €";
  banqueNiveau.innerHTML = banqueLevel;
  banquePrix.innerHTML = banqueCost + " €";
  document.getElementById("bpc-text").innerHTML = bpc;
  document.getElementById("bps-text").innerHTML = bps;
  
  // Mettre à jour l'image du billet actuel
  if (currentBilletIndex > 0 && currentBilletIndex < billetsData.length) {
    billetImage.src = billetsData[currentBilletIndex - 1].image;
    billetImage.alt = billetsData[currentBilletIndex - 1].valeur + " EUR";
  }
  
  updateBilletDisplay();

  if (arbreLevel > 0) {
    clearInterval(window.arbreInterval);
    window.arbreInterval = setInterval(() => {
      parsedBillet += arbreLevel * 100;
      billet.innerHTML = Math.floor(parsedBillet);
      saveGameLocally();
    }, 10000);
  }

  if (banqueLevel > 0) {
    clearInterval(window.banqueInterval);
    window.banqueInterval = setInterval(() => {
      parsedBillet += banqueLevel * 1000;
      billet.innerHTML = Math.floor(parsedBillet);
      saveGameLocally();
    }, 5000);
  }
}

// === RESET ===
document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Tu es sûr(e) de vouloir tout réinitialiser ?")) {
    localStorage.clear();
    
    // Réinitialiser également sur le serveur
    fetch('save_stats.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        argent: 0,
        bpc: 5,
        bps: 0,
        currentBilletIndex: 0,
        arbreLevel: 0,
        banqueLevel: 0,
        arbreCost: 2000,
        banqueCost: 100000
      })
    })
    .then(() => location.reload())
    .catch(() => location.reload());
  }
});

// === BOUTON DE DÉCONNEXION ===
document.getElementById("logout-btn").addEventListener("click", () => {
  fetch('logout.php')
    .then(() => {
      localStorage.clear(); // On vide aussi les données locales
      window.location.href = "login.php"; // Redirige vers la page de connexion
    })
    .catch(error => {
      console.error("Erreur lors de la déconnexion :", error);
    });
});

// === BOUTON DE SAUVEGARDE MANUELLE ===
document.getElementById("save-btn").addEventListener("click", saveGameManually);

// === LANCEMENT ===
loadGameFromServer();

// Sauvegarde automatique toutes les 30 secondes
setInterval(saveGameToServer, 30000);