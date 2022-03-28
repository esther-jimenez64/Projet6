// import d'express et des autres pack//

const express = require('express');
const router = express.Router();
const dov = require('dotenv').config();

//récupération des middleware d'authentification et la config de multer et du controllers des routes sauces//

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauces');
//création de mes différente routes en ajoutant en toute l'authentification avant toute choses //

router.get('/', auth, saucesCtrl.getAllSauce); //get qui récupere toute les sauces dispo ajout de mon controlleur pour les sauces//
router.post('/', auth, multer, saucesCtrl.createSauce);//post qui créé une sauces//
router.get('/:id', auth, saucesCtrl.getOneSauce);//get qui récupere une sauces spésifique avec l'id  ajout de mon controlleur//
router.put('/:id', auth, multer, saucesCtrl.modifySauce);//put qui modifie une sauces //
router.delete('/:id', auth, saucesCtrl.deleteSauce);//delete qui suprime une sauces //
router.post('/:id/like', auth, saucesCtrl.userLike); //post route des likes et dislikes//

module.exports = router;//exporter le router pour y acséder depuis un autre fichier principalment dans app.js//

