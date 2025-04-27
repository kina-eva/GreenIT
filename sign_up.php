<?php
session_start();
require_once 'db.php';

// Vérifier si l'utilisateur est déjà connecté
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

// Traitement du formulaire d'inscription
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération des données
    $email = $_POST['email'];
    $name = $_POST['name'] ?? '';
    $password = $_POST['password'];
    
    // Validation basique
    if (empty($email) || empty($password)) {
        $error = "L'email et le mot de passe sont requis";
    } elseif (strlen($password) < 6) {
        $error = "Le mot de passe doit contenir au moins 6 caractères";
    } else {
        // Vérifier si l'email existe déjà
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            $error = "Cet email est déjà utilisé";
        } else {
            // Hashage du mot de passe
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            // Insertion de l'utilisateur
            $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
            $stmt->bind_param("ss", $email, $hashed_password);
            
            if ($stmt->execute()) {
                $user_id = $conn->insert_id;
                
                // Créer des stats initiales pour l'utilisateur
                $createStats = $conn->prepare("INSERT INTO stats (user_id) VALUES (?)");
                $createStats->bind_param("i", $user_id);
                $createStats->execute();
                
                // Connecter l'utilisateur automatiquement
                $_SESSION['user_id'] = $user_id;
                
                header('Location: index.php');
                exit();
            } else {
                $error = "Erreur lors de l'inscription: " . $conn->error;
            }
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

  <title>Click'n'Cash - Inscription</title>

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
    <form class="form" method="POST" action="sign_up.php">
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
            <label>Name</label>
            <div class="inputForm">
                <input placeholder="Enter your Name" class="input" name="name" type="text">
                <!-- Name field is optional for now -->
            </div>
        </div>
        
        <div class="flex-column">
            <label>Password</label>
            <div class="inputForm">
                <input placeholder="Enter your Password" class="input" name="password" type="password" required>
            </div>
        </div>
        
        <button class="button-submit" type="submit">Sign Up</button>

        <p class="p">Already have an account? <a href="./login.php" class="span">Log In</a></p>
        <p class="p line">Or sign up with</p>

        <div class="flex-row">
            <button type="button" class="butn google">Google</button>
            <button type="button" class="butn apple">Apple</button>
        </div>
    </form>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>