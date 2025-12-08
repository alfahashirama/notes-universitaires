// Middleware pour logger les requêtes
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Capturer la fin de la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`;
    
    // Colorier selon le status code
    if (res.statusCode >= 500) {
      console.error('\x1b[31m%s\x1b[0m', logMessage); // Rouge pour erreurs serveur
    } else if (res.statusCode >= 400) {
      console.warn('\x1b[33m%s\x1b[0m', logMessage); // Jaune pour erreurs client
    } else if (res.statusCode >= 300) {
      console.info('\x1b[36m%s\x1b[0m', logMessage); // Cyan pour redirections
    } else {
      console.log('\x1b[32m%s\x1b[0m', logMessage); // Vert pour succès
    }
  });
  
  next();
};

module.exports = logger;