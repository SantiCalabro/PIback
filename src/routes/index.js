const { Router } = require("express");
const dogMiddleware = require("./dogs.js");
const tempMiddleware = require("./temperaments.js");
const breedMiddleware = require("./breeds.js");

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();
router.use("/dogs", dogMiddleware);
router.use("/breeds", breedMiddleware);
router.use("/temperaments", tempMiddleware);

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = router;
