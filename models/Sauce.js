const mongoose = require('mongoose'); //récupération de l'outils Mongoose qui  nous pouvons modéliser nos données//
//nous créons un schéma de données qui contient les champs souhaités pour chaque Sauce, indique leur type ainsi que leur caractère (obligatoire ou non)//
const sauceSchema = mongoose.Schema({//utilise la méthode Schema mise à disposition par Mongoose. Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose//                        
  userId: { type: String, required: true },  
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, min: 1, max: 10 , required: true  },//j'ajoute un maximum de 10 pour ne pas bugé le formulaire //
  likes:  { type: Number, 'default': 0 },  //les likes sont par défaut a 0//
  dislikes: { type: Number, 'default': 0 }, //les dislikes sont par défaut a 0//
  usersLiked: { type: Array, 'default': [] },//les userliked sont par défaut des tab vide//
  usersDisliked: { type: Array, 'default': [] } //les userdisliked sont par défaut des tab vide//
  });
  
  module.exports = mongoose.model('Sauce', sauceSchema);
  //ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « Sauce », le rendant par là même disponible pour notre application Express//