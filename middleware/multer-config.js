const multer = require('multer'); //récup middleware qui nous permet de traiter les téléchargements de fichiers avec notre application Express/

const MIME_TYPES = { //dictionnaire de type MIME// 
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ //Nous créons une constante storage , à passer à multer comme configuration, qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants//
  destination: (req, file, callback) => { //la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images//
    callback(null, 'images');
  },
  filename: (req, file, callback) => { 
    const name = file.originalname.split(' ').join('_');// la fonction filename indique à multer d'utiliser le nom d'origine,//
    const extension = MIME_TYPES[file.mimetype];// de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now()// 
    callback(null, name + Date.now() + '.' + extension);//comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée//
  }
});

module.exports = multer({storage: storage}).single('image');
//Nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image//