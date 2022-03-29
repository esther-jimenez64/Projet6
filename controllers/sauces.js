const Sauce = require('../models/Sauce');//const qui récupère le model shema mongose déclarer dans SAUCE//
const fs = require('fs');//Récupération du module fs fournit de nombreuses fonctionnalités comme fs.unlink pour supprimer des fichiers//
const dov = require('dotenv').config();//Récupération du module dotenv qui stocke les donnés sensible dans des variablesd'environnement//
const { Console, error } = require('console');
const auth = require('../middleware/auth');//récupération du middleware d'authentification//

exports.createSauce = (req, res, next) => {//Création de la logique de ma route post qui permet de créer une sauce, exports pour    pouvoir la récupérer et l'affect a ma route //
  const sauceObject = JSON.parse(req.body.sauce); //Création d'un objet contenant la sauce créé par l'utilisateur contenue dans la requête//
  const sauce = new Sauce({  // const sauce qui créer une instance de mon shema mongoose SAUCE//
   //Spécification de ce que l'objet  doit contenir à fin d'éviter des manœuvres malveillantes//
    userId: req.auth.userId, 
    name: sauceObject.name,  //le champs name contiendra le nom donner dans le formulaire name présent dans la requéte//
    manufacturer: sauceObject.manufacturer,//le champs manufacturer contiendra la manufacturer indiquer dans la requete//
    description: sauceObject.description, //le champs description contiendra la description indiquer dans la requete//
    mainPepper: sauceObject.mainPepper,//le champs mainPpper contiendra les ingrédient indiquer dans la requete//
    heat: sauceObject.heat,//le champs heat contiendra le degrès de piquant indquer dans la requéte//
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//req protocol récuperer le début de l'url http ou https  req.get host permet de récuperer l'host de notre serveur exemple localqhost3000 l'image et le nom du fichier//
  });
  sauce.save() //ensuite nous sauvegardon linstance de notre shema Sauce dans notre base de donné//
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { // création de la logique de ma route get qui permet de récuperer une sauces spésifique exports pour pouvoir la récuperer et l'affect a ma route //
  Sauce.findOne({  _id: req.params.id }) //nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant une  Sauce spésific de notre base de donné grace a son id contenue dans req.params//
  .then(
    (sauce) => { //le then contient la sauce récuperer avec findOne//
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

exports.modifySauce = (req, res, next) => { // création de la logique de ma route put qui permet de modifier une sauces spésifique exports pour pouvoir la récuperer  et l'affect a ma route //
  Sauce.findOne({ _id: req.params.id })//nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant une  Sauce spésific de notre base de donné grace a son id contenue dans req.params//
    .then(sauce => {//ensuite une fois la sauce spésific récuper on passe un condition//
 if( req.auth.userId ===  sauce.userId){ //si l' id de l'user qui à créé la sauce et égal l'userID qui désire modifier la sauce//
  const sauceObject = req.file ? //dans se cas là création d'un objet contenant la sauce qui sera modifier  par l'utilisateur contenue dans la requete//  

  //regarde si req.file existe ou non. S'il existe, on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. On crée ensuite une instance Sauce à partir de sauceObject , puis on effectue la modification.//                                
    {
      ...JSON.parse(req.body.sauce), //transforme un objet stringifié en Object JavaScript exploitable.//
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//reconstruire l'URL complète du fichier enregistré.//
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //nous actualisont la modification de la sauce
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))//utilisanr le paramètre id de la requête pour configurer notre Sauce avec le même _id qu'avant.//   //2ème argument le nouvelle versionde l' objet on récupere la sauce qui est dans le corps de la requete et on vérifie bien que l'id du paremettre du body est bien le meme//
    .catch(error => res.status(400).json({ error }));
  } 
  else
  {
  res.status(401).json({ error });
  }
})
}; 

// création de la logique de ma route delete qui permet de suprimmer  une sauces spésifique exports pour pouvoir la récuperer  et l'affecté a ma route //
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })//nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant une  Sauce spésific de notre base de donné grace a son id contenue dans req.params//
    .then(sauce => { //ensuite une fois la sauce spésific récuperer dans le then on passe un condition//
      if( req.auth.userId ===  sauce.userId){ ///si l' id de l'user qui à créé la sauce et égal l'userID qui désire suprimer la sauce//
      const filename = sauce.imageUrl.split('/images/')[1];//nous créont une const qui grace split un tableaux de si qu'il y a avant l'image dans l'url et après l'image et nous récuperont le 2ème eléments du tableaux qui corespend au nom du fichier // 
      fs.unlink(`images/${filename}`, () => { //nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé //
        Sauce.deleteOne({ _id: req.params.id }) //nous supriment la sauce La  avec la méthode deleteOne() nous lui passons un objet correspondant au document à supprimer. Nous envoyons ensuite une réponse de réussite ou d'échec au front-end.
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

exports.getAllSauce = (req, res, next) => { //notre logique GET qui renvoie tous les sauces disponible dans la base de données//
  Sauce.find().then(//nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les sauces/présente dans notre base de donné/
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

// création de la logique de ma route like qui permet de liké ou disliké  une sauces spésifique exports pour pouvoir la récuperer  et l'affecté a ma route //
exports.userLike = (req, res, next) => {  
  const like = req.body.like; //constante qui récupére les like du body de la réquete sois like sois dislikes//
  const userId = req.body.userId;//récupere 'id de l'user qui réalise cette requete ("le like ou dislike")//

  Sauce.findOne({ _id: req.params.id }) //nous utilisons la méthode find() dans notre modèle Mongoose afin derécupèrer l'id de la sauce qui est présent dans les paramettre du body qui contient l'id de l'user qui à créé la sauce le nom ect... et le nombre de like présent sur la sauce le nombre de likes et dislikes ansi qu'un tableau contenant l'id de user qui ont like et un autre avec les user qui disliké//

    .then((sauce) => {
      console.log(sauce);
      if (like === 1) {//si le champs like est égal à 1 alors//
        Sauce.updateOne(
          { _id: sauce._id },//alors nous mettant a jour la sauce avec l'id de la sauce en paramettre //
          {
            $inc: { likes: +1 }, // et nous utilison  Opérateur d'incrémentation ( $inc ) de MongoDB et lui affecton +1//
            $push: { usersLiked: userId },//ensuite nous injectant dans le tableaux de user ayant liké la sauce, l'user id qui réalisé cette requete //
          }
        )
          .then(() => res.status(200).json({ message: "Like ajouté" }))
          .catch((err) => res.status(400).json(err));
      } else if (like === 0) { //sinon si le like est = à 0 alors//
        Sauce.findOne({ _id: sauce._id }).then((sauce) => { //nous utilisons la méthode find() dans notre modèle Mongoose afin derécupèrer l'id de la sauce en question qui va etre liker//
         if (sauce.usersLiked.includes(userId)) {//si le champs tableaux userliked contient l'id de l'utilisateur qui fait la requete //
            Sauce.updateOne( //alors nous mettant a jour la sauce avec l'id de la sauce en paramettre //
       
              { _id: req.params.id }, 
              {
                $inc: { likes: -1 }, // et nous utilison  Opérateur d'incrémentation ( $inc ) de MongoDB et lui affecton -1//
                $pull: { usersLiked: userId },//ensuite nous injectant dans le tableaux de l'user ayant liké la sauce, l'user id qui réalisé cette requete //
              }
            )
              .then(() => res.status(200).json({ message: "Like ajouté" }))
              .catch((err) => res.status(400).json(err));
          }
        });
      }
      if (sauce.usersDisliked.includes(userId)) {//si le tableaux usersdisliked contient l'id de l'user qui réalise la requete alors//
        Sauce.updateOne(//alors nous mettant a jour la sauce avec l'id de la sauce en paramettre //
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 }, // et nous utilison  Opérateur d'incrémentation ( $inc ) de MongoDB et lui affecton -1//
            $pull: { usersDisliked: userId }, //ensuite nous injectant dans le tableaux de l'user ayant disliké la sauce, l'user id qui réalisé cette requete //
          }
        )
          .then(() => res.status(200).json({ message: "Like ajouté" }))
          .catch((err) => res.status(400).json(err));
      } else if (like === -1) {//sinon si le champ like est = -1 alors//
        Sauce.updateOne( //alors nous mettant a jour la sauce avec l'id de la sauce en paramettre //
          { _id: sauce._id },
          {
            $inc: { dislikes: +1 }, // et nous utilison  Opérateur d'incrémentation ( $inc ) de MongoDB et lui affecton +1//
            $push: { usersDisliked: userId },//ensuite nous injectant dans le tableaux de l'user ayant disliké la sauce, l'user id qui réalisé cette requete //
          }
        )
          .then(() => res.status(200).json({ message: "Like ajouté" }))
          .catch((err) => res.status(400).json(err));
      }
    })
    .catch((err) => res.status(400).json(err));
};
 
  


