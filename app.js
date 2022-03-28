const express = require('express'); //L'utilisation du framework Express simplifie les tâches et pour crée une aplication simple//

const helmet = require('helmet'); // récupération Helmet.js  un module Node.js qui aide à sécuriser les en-têtes HTTP//
const bodyParser = require('body-parser');//récuperation du middelware body parser va renseigner la propriété req.body avec le corps analysé de la requête.//
const mongoose = require('mongoose'); //récupération de l'outils Mongoose qui  nous permet de  modéliser nos données//
const path = require('path');//récupération module Path qui permet de travailler avec des répertoires et des chemins de fichiers//
 require('dotenv').config(); //récupération du module dotenv qui stocke les donné sensible dans des variables d'environement//
const saucesRoutes = require('./routes/sauces');//récupération de mes routes sauces //
const userRoutes = require('./routes/user'); //récupération de mes routes user//
const test = process.env.Secret_DB; //const qui contient l'adresse de ma base de donné//
const rateLimit = require('express-rate-limit')//récup du package ratelimit qui empêche la même adresse IP de faire trop de demandes qui nous aideront à prévenir les attaques comme la force brute////fonctionnalité très puissante pour sécuriser les API backend contre les attaques malveillantes//
const limiter = rateLimit({   //configuration de rate limit//
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limite chaque IP à 100 requêtes par window de 15min
  standardHeaders: true, // retourne l'info de limite dans les headers
  legacyHeaders: false, // désactive le 'X-rateLimit-*' headers
  skipSuccessfulRequests: true
});

//connexion avec mongoose qui gère la base de donnée MongoDB//
mongoose
.connect(
   test, //l'adresse de ma base de donné//
   { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
const app = express();//appéle à la méthode express//
//ajout à la pile de middleware express  limiter,  express.json,et de helmet//
app.use(limiter); //qui empêche la même adresse IP de faire trop de demandes //
app.use(express.json());
app.use(helmet());//qui aide à sécuriser les en-têtes HTTP//


app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Prévention des erreurs CORS et implémentaton d'helmet//
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})

app.use('/images', express.static(path.join(__dirname, 'images'))); //Cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images . Enregistrez et actualisez l'application dans le navigateur// 
app.use('/api/sauces', saucesRoutes); //méthode use nous lui passons un string, correspondant à la route pour laquelle nous souhaitons enregistrer cet élément de middleware//
app.use('/api/auth', userRoutes); //méthode use nous lui passons un string, correspondant à la route pour laquelle nous souhaitons enregistrer cet élément de middleware//

module.exports = app;//ensuite, nous exportons app//