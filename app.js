require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 3000;

const cors = require("cors");
app.use(cors());

// ===============================
//  WEBHOOK STRIPE (RAW BODY)
// ===============================
app.use("/webhook", require("./routes/webhook")); 
// ⚠️ IMPORTANTE: va ANTES de express.json()

// ===============================
//  JSON NORMAL PARA EL RESTO
// ===============================
app.use(express.json());

// Config
const upload = require("./config/multer");
const auth = require("./middleware/auth");
const supabase = require("./config/supabase");
const path = require("path");


const planesRoutes = require("./routes/planes");


//Cron
const cron = require("node-cron");
const limpiarPlanesExpirados = require("./limpiarPlanesExpirados");
const limpiarArchivosHuérfanos = require("./limpiarArchivos");
require("./cronAutoSubida");

// ===============================
//  ENDPOINTS
// ===============================

// Gestión de usuarios
app.use("/auth", require("./routes/usuarios"));

// Gestión de anuncios normales
app.use("/posts", require("./routes/anuncios"));

// Gestión de habitaciones
app.use("/habitaciones", require("./routes/habitaciones"));

// Obtener planes
app.use("/planes", planesRoutes);


// Checkout (Stripe)
app.use("/api/checkout", require("./routes/checkout"));

app.get("/pago-exitoso", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pago-exitoso.html"));
});

app.use("/api/pagos", require("./routes/pagos"));


// Cron cada 10 minutos
cron.schedule("*/10 * * * *", () => {
    limpiarPlanesExpirados();
});

cron.schedule("0 4 * * *", () => {
    limpiarArchivosHuérfanos();
});


// ===============================
//  SERVIDOR
// ===============================
app.listen(PORT, () => {
    console.log(`API REST funcionando en http://localhost:${PORT}`);
});
