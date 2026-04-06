const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../config/multer");
const hab = require("../controllers/habitacionController");

// Crear habitación
router.post("/", auth, upload.fields([
    { name: "portada", maxCount: 1 },
    { name: "galeria", maxCount: 3 }
]), hab.crearHabitacion);

// Contar visita
router.post("/:id/visita", hab.contarVisita);

// Listar mis habitaciones
router.get("/", auth, hab.listarMisHabitaciones);

// Listar públicas
router.get("/public", hab.listarPublicas);

// Obtener privada
router.get("/:id", auth, hab.obtenerHabitacionPrivada);

// Obtener pública
router.get("/public/:id", hab.obtenerHabitacionPublica);

// Editar
router.put(
    "/:id",
    auth,
    upload.fields([
        { name: "portada", maxCount: 1 },
        { name: "galeria_nueva", maxCount: 8 },
        { name: "video", maxCount: 1 },
        { name: "audio", maxCount: 1 }
    ]), hab.editarHabitacion);

// Borrar
router.delete("/:id", auth, hab.borrarHabitacion);

module.exports = router;
