// routes/planes.js

const express = require("express");
const router = express.Router();

const planesController = require("../controllers/planesController");

// GET /planes/:id
router.get("/:id", planesController.obtenerPlan);

module.exports = router;
