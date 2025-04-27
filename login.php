<?php
session_start();
require_once 'db.php';

// Vérifier si l'utilisateur est déjà connecté
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

// Traitement du formulaire de connexion
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération des données du formulaire
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    // Validation des données (basique)
    if (empty($email) || empty($password)) {
        $error = "Tous les champs sont obligatoires";
    } else {
        // Vérification des identifiants
        $stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Vérification du mot de passe
            if (password_verify($password, $user['password'])) {
                // Authentification réussie
                $_SESSION['user_id'] = $user['id'];
                
                // Vérifier si l'utilisateur a déjà des stats
                $checkStats = $conn->prepare("SELECT id FROM stats WHERE user_id = ?");
                $checkStats->bind_param("i", $user['id']);
                $checkStats->execute();
                
                if ($checkStats->get_result()->num_rows === 0) {
                    // Créer des stats par défaut
                    $createStats = $conn->prepare("INSERT INTO stats (user_id) VALUES (?)");
                    $createStats->bind_param("i", $user['id']);
                    $createStats->execute();
                }
                
                header('Location: index.php');
                exit();
            } else {
                $error = "Email ou mot de passe incorrect";
            }
        } else {
            $error = "Email ou mot de passe incorrect";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.7.1/font/bootstrap-icons.min.css">

  <title>Click'n'Cash - Connexion</title>

  <link rel="stylesheet" href="css/style.css" />
</head>

<body>
<header>
  <div class="header-left">
    <img src="images/bank.png" alt="Logo Banque" class="bank-logo">
    <h1>Click'n'Cash</h1>
  </div>
  <div class="header-right">
    <a href="login.php" class="header-button">Log In</a>
  </div>
</header>


<div class="container d-flex align-items-center justify-content-center">
    <form class="form" method="POST" action="login.php">
        <?php if (isset($error)): ?>
            <div class="alert alert-danger"><?php echo $error; ?></div>
        <?php endif; ?>
        
        <div class="flex-column">
            <label>Email</label>
            <div class="inputForm">
                <input placeholder="Enter your Email" class="input" name="email" type="email" required>
            </div>
        </div>

        <div class="flex-column">
            <label>Password</label>
            <div class="inputForm">
                <input placeholder="Enter your Password" class="input" name="password" type="password" required>
            </div>
        </div>

        <div class="flex-row">
            <div>
                <input type="checkbox" id="remember_me" name="remember_me">
                <label for="remember_me">Remember me</label>
            </div>
            <span class="span">Forgot password?</span>
        </div>

        <button class="button-submit" type="submit">Sign In</button>

        <p class="p">Don't have an account? <a href="./sign_up.php" class="span">Sign Up</a></p>
        <p class="p line">Or Sign In with</p>

        <div class="flex-row">
            <button type="button" class="butn google">Google</button>
            <button type="button" class="butn apple">Apple</button>
        </div>
    </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>