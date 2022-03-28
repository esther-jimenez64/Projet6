// import d'express et des autres pack//
const express = require('express');//récupération du framwork express//
const router = express.Router();//récupération du router qui est associer à un fichier controlleur contenant le code d'implementation //
const dov = require('dotenv').config();//récupération du package doven qui stoke des donné sensible dans des variable d'environement//
const userCtrl = require('../controllers/user');//récupération  controlleur contenant le code d'implementation pour l'users//

router.post('/signup', userCtrl.signup);//route post pour créé un compte avec son controlleur //
router.post('/login', userCtrl.login); //route post pour la connetion a un compte créé avec son controlleur//

module.exports = router; //on exports le router pour accéder a celà dans d'autre fichier js//