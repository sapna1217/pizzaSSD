const helmet = require("helmet");

module.exports = (app) => {
  // Helmet to set various HTTP headers for security
  app.use(helmet());

  // Disable 'X-Powered-By' to hide Express usage
  app.disable('x-powered-by');

  // Content Security Policy (CSP)
  
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://ajax.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'"], // allowing inline styles (optional)
      imgSrc: ["'self'", "data:", "https://yourcdn.com"],
    }
  }));
  

  // Prevent clickjacking by denying framing
  app.use(helmet.frameguard({ action: 'deny' }));

  // Prevent MIME-type sniffing
  app.use(helmet.noSniff());

  // Cloud Metadata Protection - deny access to cloud metadata
  app.use((req, res, next) => {
    if (req.ip === "169.254.169.254") {
      return res.status(403).send("Access to metadata service is blocked.");
    }
    next();
  });
  

  // Remove timestamp information (Date header)
  app.use((req, res, next) => {
    res.removeHeader('Date');
    next();
  });
};
