const mongoose = require('mongoose');//Récupération de l'outil Mongoose qui  nous permet de  modéliser nos données//
const uniqueValidator = require('mongoose-unique-validator'); //Récupération le plugin de Mongoose qui indique à Mongoose que chaque document doit avoir une valeur unique pour un chemin donné. Par exemple que l'email d'un utilisateur doit être unique//
//Pour s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail, nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur userSchema //
const userSchema = mongoose.Schema({  
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //affectant le plugin à la constante usershema//

module.exports = mongoose.model('User', userSchema);
//Ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « User », le rendant par là même disponible pour notre application Express//