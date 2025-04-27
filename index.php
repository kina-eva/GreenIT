<?php
session_start();
require_once 'db.php';

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

// Récupérer les infos de l'utilisateur si nécessaire
$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT email FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">

    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.7.1/font/bootstrap-icons.min.css"
        integrity="sha512-WYaDo1TDjuW+MPatvDarHSfuhFAflHxD87U9RoB4/CSFh24/jzUHfirvuvwGmJq0U7S9ohBXy4Tfmk2UKkp2gA=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.7.1/font/bootstrap-icons.min.css">

    <title>Click'n'Cash</title>

    <link rel="stylesheet" href="css/style.css" />
   
</head>
<body>
    <header>
    <div class="header-left">
        <img src="images/bank.jpg" alt="Logo Banque" class="bank-logo">
        <h1>Click'n'Cash</h1>
    </div>
    <div class="header-right">
        <p class="user-email">Connecté en tant que : kina.elali@gmail.com</p>
        <button id="logout-btn">Déconnexion</button>
    </div>
    </header>

    <section>
        <div class="main container d-flex justify-content-center">
            <div class="left">
                <p>Billet <br><span class="argent-total pink-text">0</span> <span class="pink-text">€</span> </p>
                <img src="images/5monopoly.jpeg" alt="5 EUR" class="billet-image" onclick="incrementBillet()" draggable="false" />
                <div class="button-container">
                    <button id="reset-btn">🔄 Réinitialiser</button>
                    <button id="save-btn">💾 Sauvegarder</button>
                </div>
           
                <div id="save-message" class="text-center">Partie sauvegardée !</div>
            </div>

            <div id="error-message" class="error-hidden">Pas assez d'argent !</div>

            <div class="right">
                <!-- Upgrade Button -->
                <div class="upgrade" onclick="buyBillet()">
                    <div class="left-section">
                        <img src="images/10monopoly.jpeg" alt="Upgrade" class="upgrade-img" />
                    </div>
                    <div class="mid-section">
                        <h4>Billet</h4>
                        <div class="cost-info">
                        <p class="cost-text"><span class="billet-prix">100 €</span></p>
                        </div>
                    </div>
                    <div class="right-section">
                        Niveau <span class="billet-niveau">0</span>
                    </div>
                    <div class="next-level-info">
                        <p>
                        + <span class="billet-increase">10</span> billets <br> par clic
                        </p>
                    </div>
                </div>

                <!--arbre-->
                <div class="upgrade" onclick="buyArbre()">
                    <div class="left-section">
                    <img src="images/arbre-argent.jpeg" alt="Upgrade" class="upgrade-img" /><!--ou arbre-argent.png c sans background-->
                    </div>
                    <div class="mid-section">
                        <h4>Arbre</h4>
                        <div class="cost-info">
                            <p class="cost-text"> <span class="arbre-prix">2000 €</span></p>
                        </div>
                    </div>
                    <div class="right-section">
                        Niveau <span class="arbre-niveau">0</span>
                    </div>
                    <div class="next-level-info">
                        <p>
                            + <span class="arbre-increase">100</span> billets <br> par 10 Secondes
                        </p>
                    </div>
                </div>
                
                <!--banque-->
                <div class="upgrade" onclick="buyBanque()">
                    <div class="left-section">
                        <img src="images/bank.png" alt="Upgrade" class="upgrade-img" />
                    </div>
                    <div class="mid-section">
                        <h4>Banque</h4>
                        <div class="cost-info">
                            <p class="cost-text"> <span class="banque-prix"> 100 000 €</span></p>
                        </div>
                    </div>
                    <div class="right-section">
                        Niveau <span class="banque-niveau">0</span>
                    </div>
                    <div class="next-level-info">
                        <p>
                            + <span class="banque-increase">1000</span> billets <br> par 5 Secondes
                        </p>
                    </div>
                </div>    
            </div>
        </div>

        <div class="statistics">
            <div class="texts">
                <p>BPC <span id="bpc-text" class="pink-text">5</span></p>
                <p>BPS <span id="bps-text" class="pink-text">0</span></p>
            </div>
        </div>
    </section>

    <!-- Call the Bootstrap Js code -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script src="index.js"></script>
</body>
</html>