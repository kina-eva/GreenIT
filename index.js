let billet = document.querySelector(".argent-total");
let parsedBillet = parseFloat(billet.innerHTML); // on tilise celle ci

let billetPrix = document.querySelector(".billet-prix");
let parsedBilletPrix = parseFloat(billetPrix.innerHTML);
//idem
let billetNiveau = document.querySelector(".billet-niveau");
let billetIncrease = document.querySelector(".billet-increase");
let parsedBilletIncrease = parseFloat(billetIncrease.innerHTML);



function incrementBillet() {
    parsedBillet += 5;
   
    billet.innerHTML = Math.round(parsedBillet += parsedBillet);
}

function buyBillet(){
    if(parsedBillet >= parsedBilletPrix){
        parsedBillet -= parsedBilletPrix;

        billetNiveau.innerHTML ++;
//apres achat dun arbre ou banque
        billetIncrease.innerHTML = parsedBilletIncrease;
        parsedBillet += parsedBilletIncrease; // on augmente le nombre de billets par clic

    }
}
  