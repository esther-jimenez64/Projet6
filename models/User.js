const mongoose = require('mongoose');//récupération de l'outils Mongoose qui  nous permet de  modéliser nos données//
const uniqueValidator = require('mongoose-unique-validator'); //récuperation le plunging de mangoose qui indique à Mongoose que chaque document doit avoir une valeur unique pour un chemin donné. Par exemple que l'email d'un utilisateur doit être unique.

//Pour s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail, nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur userSchema //
const userSchema = mongoose.Schema({  
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //affectant le plunging à la constante usershema//

module.exports = mongoose.model('User', userSchema);
//ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « User », le rendant par là même disponible pour notre application Express//