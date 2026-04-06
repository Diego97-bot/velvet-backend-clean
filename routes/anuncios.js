const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../config/multer");
const anuncio = require("../controllers/anuncioController");

// Crear anuncio
router.post("/", auth, upload.fields([
    { name: "portada", maxCount: 1 },
    { name: "galeria", maxCount: 10 }
]), anuncio.crearAnuncio);

// Editar anuncio


router.put(
    "/:id",
    auth,
    upload.fields([
        { name: "portada", maxCount: 1 },
        { name: "galeria_nueva", maxCount: 20 },
        { name: "video", maxCount: 1 },
        { name: "audio", maxCount: 1 }
    ]),
    anuncio.editarAnuncio
);


// Contar visitas
router.post("/:id/visita", anuncio.contarVisita);

// Listar mis anuncios
router.get("/", auth, anuncio.listarMisAnuncios);

// Listar públicos
router.get("/public", anuncio.listarPublicos);

// Obtener anuncio privado
router.get("/:id", auth, anuncio.obtenerAnuncioPrivado);

// Obtener anuncio público
router.get("/public/:id", anuncio.obtenerAnuncioPublico);

// Borrar anuncio
router.delete("/:id", auth, anuncio.borrarAnuncio);

module.exports = router;
