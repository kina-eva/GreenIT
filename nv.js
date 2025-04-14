// Récupérer l'affichage du total
let billet = document.querySelector(".argent-total");
let parsedBillet = parseFloat(billet.innerHTML);

// Valeurs de départ
let bpc = 5; // billets par clic
let bps = 0; // billets par seconde
document.getElementById("bpc-text").innerHTML = bpc;

// Accès aux éléments HTML
let billetImage = document.querySelector(".billet-image"); // image cliquable
let billetPrix = document.querySelector(".billet-prix");
let billetNiveau = document.querySelector(".billet-niveau");
let billetIncrease = document.querySelector(".billet-increase");
let upgradeImg = document.querySelector(".upgrade-img");

// Tableau des billets à améliorer (à partir de 10€)
const billetsData = [
  { valeur: 10, image: "images/10monopoly.jpeg", prix: 100, bpc: 10 },
  { valeur: 20, image: "images/20monopoly.png", prix: 400, bpc: 20 },
  { valeur: 50, image: "images/50monopoly.png", prix: 1000, bpc: 50 },
  { valeur: 100, image: "images/100monopoly.jpeg", prix: 2000, bpc: 100 },
  { valeur: 500, image: "images/500monopoly.png", prix: 10000, bpc: 500 },
  { valeur: 1000, image: "images/1000monopoly.jpeg", prix: 20000, bpc: 1000, nom: "Malo" },
  { valeur: 5000, image: "images/5000monopoly.png", prix: 100000, bpc: 5000, nom: "Valentin" },
  { valeur: 10000, image: "images/10000monopoly.jpg", prix: 200000, bpc: 10000, nom: "Kina" },
  { valeur: 50000, image: "images/50000monopoly.jpg", prix: 1000000, bpc: 50000, nom: "Arsène" }
];


// Index du billet à améliorer (on commence par le 10 €)
let currentBilletIndex = 0;

updateBilletDisplay(); // Met à jour la partie upgrade

//  Clic sur le billet (initialement 5€)
function incrementBillet() {
  parsedBillet += bpc;
  billet.innerHTML = Math.floor(parsedBillet);
}

//  Achat d’un nouveau billet (upgrade)
function buyBillet() {
  const billetData = billetsData[currentBilletIndex];
  if (parsedBillet >= billetData.prix) {
    // Retirer le coût
    parsedBillet -= billetData.prix;
    billet.innerHTML = Math.floor(parsedBillet);

    // Mettre à jour le BPC avec celui du nouveau billet
    bpc = billetData.bpc;
    billetIncrease.innerHTML = bpc;
    document.getElementById("bpc-text").innerHTML = bpc;

    // Mise à jour du niveau
    billetNiveau.innerHTML = currentBilletIndex + 1;

    // Changer l’image du billet cliquable
    billetImage.src = billetData.image;
    billetImage.alt = billetData.valeur + " EUR";

    // Passer au prochain billet si dispo
    if (currentBilletIndex < billetsData.length - 1) {
      currentBilletIndex++;
      updateBilletDisplay();
    } else {
      document.querySelector(".upgrade").onclick = null;
    }
  }
}


//  Met à jour l'affichage du bouton d'amélioration (droite)
function updateBilletDisplay() {
  const billetData = billetsData[currentBilletIndex];
  billetPrix.innerHTML = billetData.prix + " €";
  upgradeImg.src = billetData.image;
  upgradeImg.alt = billetData.valeur + " EUR";
}

const upgradeBtn = document.querySelector(".upgrade");

// Survol du bouton : on montre le BPC du billet à acheter
upgradeBtn.addEventListener("mouseenter", () => {
  const billetData = billetsData[currentBilletIndex];
  billetIncrease.innerHTML = billetData.bpc;
});

// Quand la souris quitte : on remet ton BPC actuel
upgradeBtn.addEventListener("mouseleave", () => {
  billetIncrease.innerHTML = bpc;
});
