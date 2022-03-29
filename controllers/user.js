
const bcrypt = require('bcrypt');//récupération du package bycrypt un algorithme de hachage nous stockerons le mot de passe de chaque utilisateur sous la forme d'un hash ou d'une chaîne chiffrée.//
const jwt = require('jsonwebtoken');  //récupération du package JSON Web Token qui est un access token (jeton d’accès) aux normes RFC 7519 qui permet un échange sécurisé de donnée entre deux parties particulierment pour l'autentification.// 
const User = require('../models/User');//récupération du shema user//

 // création de la logique de ma route post qui permet de créé un compte  exports pour  pouvoir la récuperer et l'affect a ma route //

exports.signup = (req, res, next) => {
 
  if(req.body. password.length < 5){ //condition si le mots de pass est trop court non//
    throw "Invalid password"
  };
  if(req.body.password.length > 50){ //si il est trop long non//
    throw "Invalid password"};
  const regexPassword = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/ //regex pour valider le formulaire doit contenir 1 majuscul ////1 caractère spécial et un chiffre//
  if(!regexPassword.test(req.body.password)){ //si la regex n'est pas respecter alors non//
    throw "Invalid password"
  };


  //suite de ma logique une fois que le mots de pass  correspond  à ce déclarer plus haut//
  bcrypt.hash(req.body.password, 10) //nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de saler le mot de passe 10 fois.// 
    .then(hash => { //il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré//
      const user = new User({//dans notre bloc then , nous créons un utilisateur et l'enregistrons dans la base de données, en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec// 
        email: req.body.email,
        password: hash
      });
      user.save() //La fonction save() de mongose est utilisée pour enregistrer le document dans la base de données//
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
                                 
    })
  
    .catch(error => res.status(400).json({ error }));
  
};
   
// création de la logique de ma route post qui permet de se connnécté a un compte  exports pour  pouvoir la récuperer et l'affecté a ma route //

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) //nous utilisons notre modèle Mongoose pour vérifier que l'email entré par l'utilisateur correspond à un utilisateur existant de la base de données//
    .then(user => {
      if (!user) { // si ce n'est pas  le cas , nous renvoyons une erreur 401 Unauthorized//
        return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //si l'e-mail correspond à un utilisateur existant, nous continuons//
      }
      //nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données//
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });//s'ils ne correspondent pas, nous renvoyons une erreur 401 Unauthorized et un message « Mot de passe incorrect !//
          }
          res.status(200).json({//s'ils correspondent, les informations d'identification de notre utilisateur sont valides. Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur et un token//
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