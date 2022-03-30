
const bcrypt = require('bcrypt');//Récupération du package bycrypt un algorithme de hachage nous stockerons le mot de passe de chaque utilisateur sous la forme d'un hash ou d'une chaîne chiffrée.//
const jwt = require('jsonwebtoken');  //Récupération du package JSON Web Token qui est un access token (jeton d’accès) aux normes RFC 7519 qui permet un échange sécurisé de donnée entre deux parties, particulièrement pour l'authentification// 
const User = require('../models/User');//Récupération du schéma user//

 // Création de la logique de ma route post qui permet de créer un compte. Exports pour  pouvoir la récupérer et l'affecté à ma route //

exports.signup = (req, res, next) => {
 
  if(req.body. password.length < 5){ //Condition si le mot de pass est trop court non//
    throw "Invalid password"
  };
  if(req.body.password.length > 50){ //S'il est trop long non//
    throw "Invalid password"};
  const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/ //Regex pour valider le formulaire doit contenir 1 majuscule ////1 caractère spécial et un chiffre//
  if(!regexPassword.test(req.body.password)){ //Si la regex n'est pas respecté alors non//
    throw "Invalid password"
  };


  //Suite de ma logique une fois que le mot de pass  correspond  à se déclarer plus haut//
  bcrypt.hash(req.body.password, 10) //Nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de saler le mot de passe 10 fois.// 
    .then(hash => { //Il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré//
      const user = new User({//Dans notre bloc then , nous créons un utilisateur et l'enregistrons dans la base de données, en renvoyant une réponse de réussite en cas de succès et des erreurs avec le code d'erreur en cas d'éche// 
        email: req.body.email,
        password: hash
      });
      user.save() //La fonction save() de mongose est utilisée pour enregistrer le document dans la base de données//
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
                                 
    })
  
    .catch(error => res.status(400).json({ error }));
  
};
   
// Création de la logique de ma route post qui permet de se connecter à un compte  exports pour  pouvoir la récupérer et l'affecté à ma route //

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) //Nous utilisons notre modèle Mongoose pour vérifier que l'email entré par l'utilisateur correspond à un utilisateur existant de la base de données.//
    .then(user => {
      if (!user) { // Si ce n'est pas  le cas , nous renvoyons une erreur 401 Unauthorized//
        return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //Si l'email correspond à un utilisateur existant, nous continuons////
      }
      //Nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données.//
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });//S'ils ne correspondent pas, nous renvoyons une erreur 401 Unauthorized et un message « Mot de passe incorrect !//
          }
          res.status(200).json({// S'ils correspondent, les informations d'identification de notre utilisateur sont valides. Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur et un token//
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.SECRET_TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};