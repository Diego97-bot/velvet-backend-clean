const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");
const auth = require("../middleware/auth");

// Registro y login
router.post("/register", usuarioController.register);
router.post("/login", usuarioController.login);

// Recuperación de contraseña
router.post("/recuperar", usuarioController.recuperarPassword);
router.get("/reset/:token", usuarioController.validarTokenReset);
router.post("/reset/:token", usuarioController.resetPassword);


// Perfil
router.get("/mi-perfil", auth, usuarioController.getPerfil);
router.put("/mi-perfil", auth, usuarioController.updatePerfil);
router.put("/mi-perfil/password", auth, usuarioController.updatePassword);
router.get("/mi-perfil/count", auth, usuarioController.contarPublicaciones)
router.post("/agregar-extra", auth, usuarioController.agregarAnunciosExtra);
module.exports = router;
