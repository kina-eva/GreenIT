// Valeur de base
let billet = document.querySelector(".argent-total");
let parsedBillet = parseFloat(billet.innerHTML);

// BPC / BPS
let bpc = 5;
let bps = 0;
document.getElementById("bpc-text").innerHTML = bpc;

// Accès aux éléments
let billetImage = document.querySelector(".billet-image"); // reste en 5€
let billetPrix = document.querySelector(".billet-prix");
let billetNiveau = document.querySelector(".billet-niveau");
let billetIncrease = document.querySelector(".billet-increase");
let upgradeImg = document.querySelector(".upgrade-img");

// Tableau des billets à améliorer (à partir de 10€)
const billetsData = [
  { valeur: 10, image: "images/10monopoly.jpeg", prix: 100 },
  { valeur: 20, image: "images/20monopoly.png", prix: 400 },
  { valeur: 50, image: "images/50monopoly.png", prix: 1600 },
  { valeur: 100, image: "images/100monopoly.jpeg", prix: 6400 },
];

let currentBilletIndex = 0;
let parsedBilletIncrease = 10;

updateBilletDisplay();

// Clic sur le billet (5€ fixe)
function incrementBillet() {
  parsedBillet += bpc;
  billet.innerHTML = Math.floor(parsedBillet);
}

// Achat d’un upgrade (billet plus gros)
function buyBillet() {
  const billetData = billetsData[currentBilletIndex];
  if (parsedBillet >= billetData.prix) {
    // Payer le coût
    parsedBillet -= billetData.prix;
    billet.innerHTML = Math.floor(parsedBillet);

    // Bonus immédiat
    parsedBilletIncrease += 10;
    parsedBillet += parsedBilletIncrease * 2;
    billet.innerHTML = Math.floor(parsedBillet);

    // Stats
    billetIncrease.innerHTML = parsedBilletIncrease;
    bpc += parsedBilletIncrease;
    document.getElementById("bpc-text").innerHTML = bpc;

    // Niveau
    billetNiveau.innerHTML = currentBilletIndex + 1;

    // ✅ Mettre à jour l’image cliquable (à gauche) ici
    billetImage.src = billetData.image;
    billetImage.alt = billetData.valeur + " EUR";

    // Passage au prochain niveau
    if (currentBilletIndex < billetsData.length - 1) {
      currentBilletIndex++;
      updateBilletDisplay();
    } else {
      document.querySelector(".upgrade").onclick = null;
    }
  }
}


// Mettre à jour l'affichage de l'upgrade (droite)
function updateBilletDisplay() {
  const billetData = billetsData[currentBilletIndex];

  // Met à jour l'affichage du bouton upgrade (droite)
  billetPrix.innerHTML = billetData.prix + " €";
  upgradeImg.src = billetData.image;
  upgradeImg.alt = billetData.valeur + " EUR";


}


