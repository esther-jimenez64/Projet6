const jwt = require('jsonwebtoken'); //Récupération du package JSON Web Token qui est un access token (jeton d’accès) aux normes RFC 7519 qui permet un échange sécurisé de donnée entre deux parties particulièrement pour l'authentification.// 
const { param } = require('../app');
require('dotenv').config();//Récupération du package dotenv qui stocke des données sensibles dans des variables d'environnements//
module.exports = (req, res, next) => {//Étant donné que de nombreux problèmes peuvent se produire, nous insérons tout à l'intérieur d'un bloc try...catch//
  try {
    const token = req.headers.authorization.split(' ')[1];//Nous extrayons le token du header Autorisation de la requête entrante contient également le mot-clé Bearer donc la fonction split permet de récupérer tout après l'espace dans le header//
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);//Nous utilisons ensuite la fonction verify pour décoder notre token//
    const userId = decodedToken.userId; //Nous extrayons l'ID utilisateur de notre token//
    req.auth = { userId }; //Nous assignons la valeur de la variable  userId  à la clé  userId  de l'objet  auth//
    if (req.body.userId && req.body.userId !== userId) { //Si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur //
      throw 'Invalid user ID';
    } else {//Dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next()//
      next();
    }
  } catch {
    res.status(401).json({
      error:'Invalid request!'
    });
  }
};

