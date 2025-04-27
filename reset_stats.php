<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);


session_start();
require_once 'db.php';

// Pour dire qu'on retourne du JSON
header('Content-Type: application/json');

// Vérifie que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté']);
    exit();
}

$userId = $_SESSION['user_id'];

// Prépare la requête pour tout remettre à zéro
$stmt = $conn->prepare("
    UPDATE stats 
SET argent = 0, 
    bpc = 5, 
    bps = 0, 
    currentBilletIndex = 0, 
    arbreLevel = 0, 
    banqueLevel = 0, 
    arbreCost = 2000, 
    banqueCost = 100000
WHERE user_id = ?

");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Erreur préparation requête']);
    exit();
}

$stmt->bind_param("i", $userId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur d\'exécution']);
}

$stmt->close();
$conn->close();
?>
