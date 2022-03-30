// Import d'express et des autres packs//

const express = require('express');
const router = express.Router();
const dov = require('dotenv').config();

//Récupération des middlewares d'authentification et la config de multer et du contrôleur des routes sauces//

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauces');
//Création de mes différentes routes en ajoutant en toute l'authentification avant toutes choses //

router.get('/', auth, saucesCtrl.getAllSauce); //get qui récupère toutes les sauces dispo ajout de mon contrôleur pour les sauces//
router.post('/', auth, multer, saucesCtrl.createSauce);//post qui créer une sauce//
router.get('/:id', auth, saucesCtrl.getOneSauce);///get qui récupère une sauce spécifique avec l'id  ajouté de mon contrôleur/
router.put('/:id', auth, multer, saucesCtrl.modifySauce);//put qui modifie une sauce //
router.delete('/:id', auth, saucesCtrl.deleteSauce);//delete qui supprime une sauce //
router.post('/:id/like', auth, saucesCtrl.userLike); //post route des likes et dislikes//

module.exports = router;//Exporter le router pour y accéder depuis un autre fichier principalement dans app.js//

