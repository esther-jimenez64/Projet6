const Sauce = require('../models/Sauce');//const qui récupère le model schéma  mongose déclarer dans SAUCE//
const fs = require('fs');//Récupération du module fs fournit de nombreuses fonctionnalités comme fs.unlink pour supprimer des fichiers//
const dov = require('dotenv').config();//Récupération du module dotenv qui stocke les donnés sensible dans des variables d'environnement//
const { Console, error } = require('console');
const auth = require('../middleware/auth');//Récupération du middleware d'authentification//

exports.createSauce = (req, res, next) => {//Création de la logique de ma route post qui permet de créer une sauce, exports pour    pouvoir la récupérer et l'affect a ma route //
  const sauceObject = JSON.parse(req.body.sauce); //Création d'un objet contenant la sauce créé par l'utilisateur contenue dans la requête//
  const sauce = new Sauce({  // const sauce qui créer une instance de mon  schéma  mongoose SAUCE//
   //Spécification de ce que l'objet  doit contenir à fin d'éviter des manœuvres malveillantes//
    userId: req.auth.userId, 
    name: sauceObject.name,  //Le champ name contiendra le nom donner dans le formulaire name présent dans la requête//
    manufacturer: sauceObject.manufacturer,//Le champ manufacturer contiendra la manufacture indiquer dans la requête//
    description: sauceObject.description, //Le champ description contiendra la description indiquer dans la requête//
    mainPepper: sauceObject.mainPepper,//Le champ mainPepper contiendra les ingrédients indiquer dans la requête//
    heat: sauceObject.heat,//Le champ heat contiendra le degré de piquant indiquer dans la requête//
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//req protocol récupère le début de l'url http ou https  req.get host permet de récupérer l'host de notre serveur exemple localhost3000 l'image et le nom du fichier//
  });
  sauce.save() //Ensuite nous sauvegardons l'instance de notre schéma Sauce dans notre base de donné//
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { // Création de la logique de ma route get qui permet de récupérer une sauce spécifique exports pour pouvoir la récupérer et l'affect a ma route //
  Sauce.findOne({  _id: req.params.id }) //Nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant une  Sauce spécifique de notre base de donné grâce à son id contenue dans req.params//
  .then(
    (sauce) => { //le then contient la sauce récupérer avec findOne//
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => { // Création de la logique de ma route put qui permet de modifier une sauce spécifique exports pour pouvoir la récupérer  et l'affect a ma route //
  Sauce.findOne({ _id: req.params.id })//Nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant une  Sauce spécifique de notre base de donné grâce à son id contenue dans req.params//
    .then(sauce => {//Ensuite une fois la sauce spécifique récupérer, on passe une condition//
      if( req.auth.userId ===  sauce.userId){//Si l' id de l'user qui a créé la sauce et égal l'userID qui désire supprimer l'image//
        let filenam = sauce.imageUrl.split('/images/')[1];//Nous créant une const qui grâce split un tableau de-ci qu'il y a avant l'image dans l'url et après l'image et nous récupérant le 2ᵉ éléments du tableau qui correspond au nom du fichier. //
        fs.unlink(`images/${filenam}`, () => { //Nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé. //
          }
        )}
      if( req.auth.userId ===  sauce.userId){ //Si l' id de l'user qui a créé la sauce et égal l'userID qui désire modifier la sauce//
        const sauceObject = req.file ? //Dans ce cas-la création d'un objet contenant la sauce qui sera modifier  par l'utilisateur contenu dans la requête//
          
          // // Opérateur ternaire pour vérifier si fichier image existe ou non S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. On crée ensuite une instance Sauce à partir de sauceObject , puis on effectue la modification.//
          {
            ...JSON.parse(req.body.sauce), //Transforme un objet stringifié en Object JavaScript exploitable.//
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//Reconstruire l'URL complète du fichier enregistré.//
          } : { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //Nous actualisant la modification de la sauce
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))//Utilisant le paramètre id de la requête pour configurer notre Sauce avec le même _id qu'avant.//   //2ème argument, la nouvelle version de l'objet on récupère la sauce qui est dans le corps de la requête et on vérifie bien que l'id du paramètre du body est bien le mêmee//
          .catch(error => res.status(400).json({ error }));
      }
      else
      {
        res.status(401).json({ error });
      }
    })
};


// Création de la logique de ma route delete qui permet de supprimer  une sauce spécifique exports pour pouvoir la récupérer  et l'affecté à ma route //
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })//Nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant une  Sauce spécifique de notre base de donné grâce à son id contenue dans req.params//
    .then(sauce => { //Ensuite une fois la sauce spécifique récupérée dans le then on passe une condition//
      if( req.auth.userId ===  sauce.userId){ ///Si l' id de l'user qui a créé la sauce et égal l'userID qui désire supprimer la sauce//
      const filename = sauce.imageUrl.split('/images/')[1];//Nous créant une const qui grâce split un tableau de-ci qu'il y a avant l'image dans l'url et après l'image et nous récupérant le 2ᵉ éléments du tableau qui correspond au nom du fichier. // 
      fs.unlink(`images/${filename}`, () => { //Nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé //
        Sauce.deleteOne({ _id: req.params.id }) //Nous supprimant la sauce   avec la méthode deleteOne() nous lui passons un objet correspondant au document à supprimer. Nous envoyons ensuite une réponse de réussite ou d'échec au front-end.
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
        } 
      )}
        else
        {
          console.log( res.status(401).json({ error }));
        }
      })
      }; 

exports.getAllSauce = (req, res, next) => { //Notre logique GET qui renvoie toutes les sauces disponibles dans la base de données//
    Sauce.find().then(//nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant toutes les sauces/présente dans notre base de donné//
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Création de la logique de ma route like qui permet de liker ou disliker  une sauce spécifique exports pour pouvoir la récupérer  et l'affecté à ma route //
exports.userLike = (req, res, next) => {  
  const like = req.body.like; //Constante qui récupère les likes du body de la requête sois like sois dislikes//
  const userId = req.body.userId;//Constante qui récupère 'id de l'user qui réalise cette requête ("le like ou dislike")//

  Sauce.findOne({ _id: req.params.id }) //Nous utilisons la méthode find() dans notre modèle Mongoose afin de récupérer l'id de la sauce qui est présent dans les paramètres du body qui contient l'id de l'user qui à créé la sauce, le nom ect... et le nombre de like présent sur la sauce le nombre de likes et dislikes ainsi qu'un tableau contenant l'id de user qui ont liker et un autre avec les user qui disliker//

    .then((sauce) => {
      console.log(sauce);
      if (like === 1) {//Si le champ like est égal à 1 alors//
        Sauce.updateOne(
          { _id: sauce._id },//Alors nous mettant à jour la sauce avec l'id de la sauce en paramètre //
          {
            $inc: { likes: +1 }, // Et nous utilisons  Opérateur d'incrémentation ( $inc ) de MongoDB et lui affectons +1//
            $push: { usersLiked: userId },//Ensuite nous injectant dans le tableau d'user ayant liké la sauce, l'user id qui  a réalisé cette requête //
          }
        )
          .then(() => res.status(200).json({ message: "Like ajouté" }))
          .catch((err) => res.status(400).json(err));
      } else if (like === 0) { //Sinon si le like est = à 0 alors//
        Sauce.findOne({ _id: sauce._id }).then((sauce) => { //Nous utilisons la méthode find() dans notre modèle Mongoose afin de récupérer l'id de la sauce en question qui va être liké.//
         if (sauce.usersLiked.includes(userId)) {//Si le champ tableaux userliked contient l'id de l'utilisateur qui fait la requête //
            Sauce.updateOne( ///Alors nous mettant a jour la sauce avec l'id de la sauce en paramètre // //
       
              { _id: req.params.id }, 
              {
                $inc: { likes: -1 }, // Et nous utilisons  Opérateur d'incrémentation ( $inc ) de MongoDB et lui affectons -1//
                $pull: { usersLiked: userId },//Ensuite nous injectant dans le tableau de l'user ayant liké la sauce, l'user id qui réalisé cette requête //
              }
            )
              .then(() => res.status(200).json({ message: "Like ajouté" }))
              .catch((err) => res.status(400).json(err));
          }
        });
      }
      if (sauce.usersDisliked.includes(userId)) {//Si le tableau usersdisliked contient l'id de l'user qui réalise la requête alors//
                Sauce.updateOne(//Alors nous mettant à jour la sauce avec l'id de la sauce en paramètre //
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 }, // Et nous utilisons  Opérateur d'incrémentation ( $inc ) de MongoDB et lui affectons -1//
            $pull: { usersDisliked: userId }, //Ensuite nous injectant dans le tableau de l'user ayant disliké la sauce, l'user id qui réalisé cette requête //
          }
        )
          .then(() => res.status(200).json({ message: "Like ajouté" }))
          .catch((err) => res.status(400).json(err));
      } else if (like === -1) {//Sinon si le champ like est = -1 alors//
        Sauce.updateOne( //Alors nous mettant à jour la sauce avec l'id de la sauce en paramètre //
          { _id: sauce._id },
          {
            $inc: { dislikes: +1 }, // Et nous utilisons  Opérateur d'incrémentation ( $inc ) de MongoDB et lui affectons +1//
            $push: { usersDisliked: userId },//Ensuite nous injectant dans le tableau de l'user ayant disliké la sauce, l'user id qui réalisé cette requête //
          }
        )
          .then(() => res.status(200).json({ message: "Like ajouté" }))
          .catch((err) => res.status(400).json(err));
      }
    })
    .catch((err) => res.status(400).json(err));
};
 
  


