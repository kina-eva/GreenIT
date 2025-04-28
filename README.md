# GreenIT
Présentation du projet:
Click'n'Cash est un mini-jeu de type "idle game"

Fonctionnalités principales:

  -Système de clic pour générer de l'argent.
  -Achats d'améliorations (Billets, Arbres, Banque) pour augmenter les revenus passifs.
  -Sauvegarde automatique et manuelle des données (localStorage et base de données).
  -Gestion de comptes utilisateurs (connexion / déconnexion).
  -Réinitialisation complète de la progression.

Technologies utilisées:

  -Front-end : HTML5, CSS3, JavaScript (vanilla)
  -Back-end : PHP, MySQL
  -Base de données : MySQL
  -Environnement de développement : Visual Studio Code
  -Serveur local : XAMPP
  -Versionning : Git & GitHub
  -FTP : FileZilla
  -Hébergement : AWS (Amazon Web Services)

Architecture du projet:

  /css              → Fichiers de styles (style.css)
  /images           → Images utilisées dans le projet (billets, icônes, etc.)
  /sql              → Base de données (clickncash.sql)
  index.php         → Page principale du jeu
  index.js          → Logique du jeu côté client (JavaScript)
  db.php            → Connexion à la base de données
  login.php         → Page de connexion des utilisateurs
  sign_up.php       → Page d'inscription des utilisateurs
  logout.php        → Déconnexion des utilisateurs
  load_stats.php    → Chargement des statistiques de jeu
  save_stats.php    → Sauvegarde des statistiques de jeu
  reset_stats.php   → Réinitialisation des données utilisateur
  nv.html / nv.js   → Pages et scripts supplémentaires (copies)
  README.md         → Fichier de documentation du projet

Résultats écologiques:
  Score : A (90/100)
  Taille moyenne des pages : 0,246 Mo
  Nombre moyen de requêtes : 11
