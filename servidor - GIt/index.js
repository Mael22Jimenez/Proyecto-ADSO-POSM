// --------------------------------------
// ✅ DEPENDENCIAS
// --------------------------------------
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3305;

// --------------------------------------
// ✅ MIDDLEWARES
// --------------------------------------
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------
// ✅ CONEXIÓN MYSQL
// --------------------------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar MySQL:", err);
  } else {
    console.log("✅ Conectado correctamente a la base de datos");
  }
});

// --------------------------------------
// ✅ ENDPOINTS
// --------------------------------------

// 🔹 Verificación rápida
app.get("/healthz", (req, res) => res.send("ok"));

// 🔹 Obtener categorías
app.get("/api/categorias", (req, res) => {
  const query = "SELECT idCategoria, nombre FROM Categoria";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener categorías:", err);
      return res.status(500).json({ error: "Error al obtener categorías" });
    }
    res.json(results);
  });
});

// 🔹 Registrar producto o planta
app.post("/api/guardar-producto", (req, res) => {
  const { categoria, nombre, tipo, estado, fecha_siembra, ubicacion, costo, descripcion } = req.body;

  if (!categoria || !nombre) {
    return res.status(400).json({ mensaje: "Faltan datos requeridos" });
  }

  // Si es planta, registrar en Planta + Producto
  if (categoria.toLowerCase().includes("planta")) {
    const insertProducto = `
      INSERT INTO Producto (idCategoria, nombre, descripcion, precio, stock, unidad_medida, fecha_registro)
      VALUES ((SELECT idCategoria FROM Categoria WHERE nombre = ? LIMIT 1), ?, ?, ?, 0, 'unidad', NOW())
    `;
    db.query(insertProducto, [categoria, nombre, descripcion, costo], (err, result) => {
      if (err) {
        console.error("❌ Error al guardar producto base:", err);
        return res.status(500).json({ mensaje: "Error al guardar producto base" });
      }

      const idProducto = result.insertId;
      const insertPlanta = `
        INSERT INTO Planta (idProducto, nombre, tipo, estado, fecha_siembra, ubicacion)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(insertPlanta, [idProducto, nombre, tipo, estado, fecha_siembra, ubicacion], (err2) => {
        if (err2) {
          console.error("❌ Error al guardar planta:", err2);
          return res.status(500).json({ mensaje: "Error al guardar planta" });
        }
        res.json({ mensaje: "🌱 Planta registrada con éxito" });
      });
    });
  } else {
    // Si es otro tipo de producto
    const insertProducto = `
      INSERT INTO Producto (idCategoria, nombre, descripcion, precio, stock, unidad_medida, fecha_registro)
      VALUES ((SELECT idCategoria FROM Categoria WHERE nombre = ? LIMIT 1), ?, ?, ?, 0, 'unidad', NOW())
    `;
    db.query(insertProducto, [categoria, nombre, descripcion, costo], (err) => {
      if (err) {
        console.error("❌ Error al guardar producto:", err);
        return res.status(500).json({ mensaje: "Error al guardar producto" });
      }
      res.json({ mensaje: "📦 Producto registrado con éxito" });
    });
  }
});

// 🔹 Obtener productos y plantas con precio y descripción combinada
app.get("/api/productos", (req, res) => {
  const query = `
    SELECT 
      p.idProducto AS id,
      p.nombre,
      c.nombre AS categoria,
      COALESCE(
        NULLIF(p.descripcion, ''),
        CONCAT('Tipo: ', pl.tipo, ', Estado: ', pl.estado, ', Ubicación: ', pl.ubicacion)
      ) AS descripcion,
      p.precio,
      p.stock
    FROM Producto p
    INNER JOIN Categoria c ON p.idCategoria = c.idCategoria
    LEFT JOIN Planta pl ON p.idProducto = pl.idProducto
    ORDER BY p.idProducto DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error al obtener productos:", err);
      return res.status(500).json({ error: "Error al obtener productos" });
    }
    res.json(results);
  });
});

// ✅ Endpoint: Login de usuario
app.post("/login", (req, res) => {
  const { usuario, clave } = req.body;

  if (!usuario || !clave) {
    return res.status(400).json({
      login: false,
      mensaje: "Faltan campos obligatorios",
    });
  }

  const query = `
    SELECT idUsuario, nombre, apellido, correo, estado, idRol
    FROM Usuario
    WHERE usuario = ? AND clave = ? AND estado = 'Activo'
  `;

  db.query(query, [usuario, clave], (err, result) => {
    if (err) {
      console.error("❌ Error al autenticar usuario:", err);
      return res.status(500).json({
        login: false,
        mensaje: "Error del servidor",
      });
    }

    if (result.length > 0) {
      res.json({ login: true, usuario: result[0] });
    } else {
      res.json({
        login: false,
        mensaje: "Usuario o contraseña incorrectos o inactivo",
      });
    }
  });
});

// --------------------------------------
// 🚀 ARRANQUE DEL SERVIDOR
// --------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});