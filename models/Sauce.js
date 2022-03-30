const mongoose = require('mongoose'); //Récupération de l'outil Mongoose qui  nous pouvons modéliser nos données//
//nous créons un schéma de données qui contient les champs souhaités pour chaque Sauce, indique leur type ainsi que leur caractère (obligatoire ou non)//
const sauceSchema = mongoose.Schema({//Utilise la méthode Schéma mise à disposition par Mongoose. Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose//                        
  userId: { type: String, required: true },  
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, min: 1, max: 10 , required: true  },//J'ajoute un maximum de 10 pour ne pas bugé le formulaire //
  likes:  { type: Number, 'default': 0 },  //Les likes sont par défaut à 0//
  dislikes: { type: Number, 'default': 0 }, //Les dislikes sont par défaut à 0//
  usersLiked: { type: Array, 'default': [] },//Les userliked sont par défaut des tab vide//
  usersDisliked: { type: Array, 'default': [] } //Les userdisliked sont par défaut des tab vide//
  });
  
  module.exports = mongoose.model('Sauce', sauceSchema);
  //Ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « Sauce », le rendant par là même disponible pour notre application Express//