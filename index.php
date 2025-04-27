<?php
session_start();
require_once 'db.php';

$isLoggedIn = isset($_SESSION['user_id']);
$email = '';

if ($isLoggedIn) {
    $userId = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT email FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $email = $result['email'] ?? 'Utilisateur';
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Click'n'Cash</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>

<header>
    <div class="header-left">
        <img src="images/bank.png" alt="Logo Banque" class="bank-logo">
        <h1>Click'n'Cash</h1>
    </div>
    <div class="header-right">
        <?php if ($isLoggedIn): ?>
            <p class="user-email">Connecté en tant que : <?php echo htmlspecialchars($email); ?></p>
            <button id="logout-btn">Déconnexion</button>
        <?php else: ?>
            <a href="login.php" class="header-button">Connexion</a>
        <?php endif; ?>
    </div>
</header>

<section>
    <div class="main container d-flex justify-content-center">
        <div class="left">
            <p>Billet<br><span class="argent-total pink-text">0</span> <span class="pink-text">€</span></p>
            <img src="images/5monopoly.jpeg" alt="5 EUR" class="billet-image" onclick="incrementBillet()" draggable="false" />

            <div class="button-container">
                <button id="reset-btn">🔄 Réinitialiser</button>
                <button id="save-btn">💾 Sauvegarder</button>
            </div>

            <div id="save-message" class="text-center">Partie sauvegardée !</div>
        </div>

        <div class="right">
            <div class="upgrade" onclick="buyBillet()">
                <div class="left-section">
                    <img src="images/10monopoly.jpeg" alt="Upgrade" class="upgrade-img" />
                </div>
                <div class="mid-section">
                    <h4>Billet</h4>
                    <p class="cost-text"><span class="billet-prix">100 €</span></p>
                </div>
                <div class="right-section">
                    Niveau <span class="billet-niveau">0</span>
                </div>
                <div class="next-level-info">
                    <p>+<span class="billet-increase">10</span> billets<br>par clic</p>
                </div>
            </div>

            <div class="upgrade" onclick="buyArbre()">
                <div class="left-section">
                    <img src="images/arbre-argent.jpeg" alt="Upgrade" class="upgrade-img" />
                </div>
                <div class="mid-section">
                    <h4>Arbre</h4>
                    <p class="cost-text"><span class="arbre-prix">2000 €</span></p>
                </div>
                <div class="right-section">
                    Niveau <span class="arbre-niveau">0</span>
                </div>
                <div class="next-level-info">
                    <p>+<span class="arbre-increase">100</span> billets<br>par 10s</p>
                </div>
            </div>

            <div class="upgrade" onclick="buyBanque()">
                <div class="left-section">
                    <img src="images/bank.png" alt="Upgrade" class="upgrade-img" />
                </div>
                <div class="mid-section">
                    <h4>Banque</h4>
                    <p class="cost-text"><span class="banque-prix">100 000 €</span></p>
                </div>
                <div class="right-section">
                    Niveau <span class="banque-niveau">0</span>
                </div>
                <div class="next-level-info">
                    <p>+<span class="banque-increase">1000</span> billets<br>par 5s</p>
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

    <div id="error-message" class="error-hidden"></div>
</section>

<script>
    const isLoggedIn = <?php echo json_encode($isLoggedIn); ?>;
</script>

<script src="index.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
