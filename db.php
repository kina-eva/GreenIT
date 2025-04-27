<?php
// Paramètres de connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "root"; 
$database = "clickncash";

// Connexion
$conn = new mysqli($servername, $username, $password, $database);

// Vérification de connexion
if ($conn->connect_error) {
    die("Échec de la connexion : " . $conn->connect_error);
}
?>