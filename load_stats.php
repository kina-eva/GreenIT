<?php
session_start();
require_once 'db.php';

// Vérifier que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'Non autorisé']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Récupérer les stats de l'utilisateur
$stmt = $conn->prepare("SELECT * FROM stats WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Retourner les stats
    $stats = $result->fetch_assoc();
    echo json_encode($stats);
} else {
    // Créer des stats par défaut
    $defaultStats = [
        'argent' => 0,
        'bpc' => 5,
        'bps' => 0,
        'currentBilletIndex' => 0,
        'arbreLevel' => 0,
        'banqueLevel' => 0,
        'arbreCost' => 2000,
        'banqueCost' => 100000
    ];
    
    // Insérer les stats par défaut dans la base de données
    $stmt = $conn->prepare("INSERT INTO stats (user_id, argent, bpc, bps, currentBilletIndex, arbreLevel, banqueLevel, arbreCost, banqueCost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("idddiiidi", $user_id, $defaultStats['argent'], $defaultStats['bpc'], $defaultStats['bps'], $defaultStats['currentBilletIndex'], $defaultStats['arbreLevel'], $defaultStats['banqueLevel'], $defaultStats['arbreCost'], $defaultStats['banqueCost']);
    $stmt->execute();
    
    // Retourner les stats par défaut
    echo json_encode($defaultStats);
}

$stmt->close();
$conn->close();
?>