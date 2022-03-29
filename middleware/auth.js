const jwt = require('jsonwebtoken'); //récupération du package JSON Web Token qui est un access token (jeton d’accès) aux normes RFC 7519 qui permet un échange sécurisé de donnée entre deux parties particulierment pour l'autentification.// 
const { param } = require('../app');
require('dotenv').config();//récupération du package doven qui stoke des donné sensible dans des variable d'environement//
module.exports = (req, res, next) => {//étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try...catch//
  try {
    const token = req.headers.authorization.split(' ')[1];//nous extrayons le token du header Authorization de la requête entrante.Il contien également le mot-clé Bearer donc la fonction split permet de récupérer tout après l'espace dans le header//
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);//nous utilisons ensuite la fonction verify pour décoder notre token//
    const userId = decodedToken.userId; //nous extrayons l'ID utilisateur de notre token//
    req.auth = { userId }; //nous assignons la valeur de la variable  userId  à la clé  userId  de l'objet  auth//
    if (req.body.userId && req.body.userId !== userId) { //si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur //
      throw 'Invalid user ID';
    } else {//dans le cas contraire, tout fonctionne, et notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next()//
      next();
    }
  } catch {
    res.status(401).json({
      error:'Invalid request!'
    });
  }
};

