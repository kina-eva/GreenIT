<?php
// Paramètres de connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "0LnKAZq!x=0a"; 
$database = "clickncash";

// Connexion
$conn = new mysqli($servername, $username, $password, $database);

// Vérification de connexion
if ($conn->connect_error) {
    die("Échec de la connexion : " . $conn->connect_error);
}
?>
