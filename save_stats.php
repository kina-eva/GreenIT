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

// Récupérer les données JSON
$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!$data) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => 'Données invalides']);
    exit();
}

// Récupérer les données du jeu
$argent = $data['argent'] ?? 0;
$bpc = $data['bpc'] ?? 5;
$bps = $data['bps'] ?? 0;
$currentBilletIndex = $data['currentBilletIndex'] ?? 0;
$arbreLevel = $data['arbreLevel'] ?? 0;
$banqueLevel = $data['banqueLevel'] ?? 0;
$arbreCost = $data['arbreCost'] ?? 2000;
$banqueCost = $data['banqueCost'] ?? 100000;

// Vérifier si l'utilisateur a déjà des stats
$check = $conn->prepare("SELECT id FROM stats WHERE user_id = ?");
$check->bind_param("i", $user_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    // Mettre à jour les stats existantes
    $stmt = $conn->prepare("UPDATE stats SET argent = ?, bpc = ?, bps = ?, currentBilletIndex = ?, arbreLevel = ?, banqueLevel = ?, arbreCost = ?, banqueCost = ? WHERE user_id = ?");
    $stmt->bind_param("dddiiiddi", $argent, $bpc, $bps, $currentBilletIndex, $arbreLevel, $banqueLevel, $arbreCost, $banqueCost, $user_id);
} else {
    // Créer de nouvelles stats
    $stmt = $conn->prepare("INSERT INTO stats (user_id, argent, bpc, bps, currentBilletIndex, arbreLevel, banqueLevel, arbreCost, banqueCost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("idddiiidi", $user_id, $argent, $bpc, $bps, $currentBilletIndex, $arbreLevel, $banqueLevel, $arbreCost, $banqueCost);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Sauvegarde OK']);
} else {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Erreur de sauvegarde: ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>