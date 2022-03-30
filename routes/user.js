// Import d'express et des autres packs//
const express = require('express');//Récupération du framework express//
const router = express.Router();// //Récupération du routeur qui est associé à un fichier contrôleur contenant le code d'implémentations
const dov = require('dotenv').config();//Récupération du package dotenv qui stocke des donnés sensible dans des variables d'environnements//
const userCtrl = require('../controllers/user');//Récupération  contrôleurs contenant le code d'implémentation pour l'user//

router.post('/signup', userCtrl.signup);//route post pour créer un compte avec son contrôleur //
router.post('/login', userCtrl.login); //route post pour la connexion à un compte créé avec son contrôleur//

module.exports = router; //On exporte le router pour accéder a cela dans d'autre fichier js//