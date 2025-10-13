// Importar dependencias
require("dotenv").config(); // Carga variables desde .env
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173", //URL del frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión con MySQL (Clever Cloud)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Verificar conexión
db.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar con la base de datos:", err);
        return;
    }
    console.log("✅ Conexión exitosa a la base de datos");
});

// Endpoint: Crear planta
app.post("/create", (req, res) => {
    const { id_planta, especie, siembra, fase, estado, costo } = req.body;

    const query = "INSERT INTO viver_planta (id_planta, Especie, Siembra, Fase, Estado, Costo) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [id_planta, especie, siembra, fase, estado, costo];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error al insertar planta:", err);
            res.status(500).send("Error en el servidor");
        } else {
            res.send("🌱 Planta creada con éxito");
        }
    });
});

// Endpoint: Leer plantas
app.get("/read", (req, res) => {
    db.query("SELECT * FROM viver_planta", (err, result) => {
        if (err) {
            console.error("Error al obtener plantas:", err);
            res.status(500).send("Error en el servidor");
        } else {
            res.send(result);
        }
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3305;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

// Endpoint: Login de usuario
app.post("/login", (req, res) => {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json({ login: false, mensaje: "Faltan campos obligatorios" });
  }

  const query = `
    SELECT idUsuario, nombre, apellido, correo, estado, idRol
    FROM  \`Usuario\`
    WHERE usuario = ? AND clave = ? AND estado = 'Activo'
  `;

  db.query(query, [usuario, clave], (err, result) => {
    if (err) {
      console.error("❌ Error al autenticar usuario:", err);
      return res.status(500).json({ login: false, mensaje: "Error del servidor" });
    }

    if (result.length > 0) {
      res.json({ login: true, usuario: result[0] });
    } else {
      res.json({ login: false, mensaje: "Usuario o contraseña incorrectos o inactivo" });
    }
  });
});