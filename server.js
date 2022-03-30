const http = require('http');//importez le package HTTP natif de Node et l'utilisez pour créer un serveur//
const app = require('./app');//Exécutez l'application Express sur le serveur Node//

const normalizePort = val => { //la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne//
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000'); // Indiquer à l'app express sur quel port elle doit tourner//
app.set('port', port);

const errorHandler = error => { //la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur//
  if (error.syscall !== 'listen') { //un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console//
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app); // Création du serveur avec méthode creteServer qui reçoit la fonction app//

server.on('error', errorHandler);// appel de la fonction de gestion d'erreur//
server.on('listening', () => {// écoute du port d'exécution du serveur//
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);// Écoute des requêtes envoyées par le port disponible//

