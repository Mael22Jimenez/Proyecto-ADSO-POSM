
// Dependencias

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3305;


// Intermediarios

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Conexion MYSQL

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

// Endpoints

// Verificación rápida
app.get("/healthz", (req, res) => res.send("ok"));

// Obtener categorías
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

app.post("/api/guardar-producto", (req, res) => {
  const { idProducto, categoria, nombre, tipo, estado, fecha_siembra, ubicacion, costo, descripcion, tipoMovimiento, cantidad } = req.body;

  if (!tipoMovimiento || !cantidad) {
    return res.status(400).json({ mensaje: "Faltan datos requeridos" });
  }

  // Si es una salida (solo restar stock)

  if (tipoMovimiento === "Salida") {

    if (!idProducto) {
      return res.status(400).json({ mensaje: "Debe seleccionar un producto para salida." });
    }

    // Consultar stock actual
    const consultaStock = "SELECT stock FROM Producto WHERE idProducto = ?";

    db.query(consultaStock, [idProducto], (errS, rows) => {
      if (errS) {
        console.error("❌ Error al consultar stock:", errS);
        return res.status(500).json({ mensaje: "Error al consultar stock" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }

      const stockActual = rows[0].stock;

      if (stockActual < cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente. Stock actual: ${stockActual}`,
        });
      }

      // Restar stock
      const updateStock = `
        UPDATE Producto
        SET stock = stock - ?
        WHERE idProducto = ?
      `;

      db.query(updateStock, [cantidad, idProducto], (err3) => {
        if (err3) {
          console.error("❌ Error al actualizar stock:", err3);
          return res.status(500).json({ mensaje: "Error al actualizar stock" });
        }

        //Registrar movimiento
        const insertMovimiento = `
          INSERT INTO MovimientoInventario (idProducto, tipo, cantidad, fecha, observacion)
          VALUES (?, ?, ?, NOW(), ?)
        `;

        db.query(insertMovimiento, [idProducto, "Salida", cantidad, descripcion], (err4) => {
          if (err4) console.error("❌ Error al registrar movimiento:", err4);

          return res.json({ mensaje: "✔️ Salida registrada con éxito" });
        });
      });
    });

    return;
  }

  //Si es una entrada (crear producto o planta)

  if (!categoria || !nombre) {
    return res.status(400).json({ mensaje: "Faltan datos para crear producto" });
  }

  const insertProducto = `
    INSERT INTO Producto (idCategoria, nombre, descripcion, precio, stock, unidad_medida, fecha_registro)
    VALUES (
      (SELECT idCategoria FROM Categoria WHERE nombre = ? LIMIT 1),
      ?, ?, ?, 0, 'unidad', NOW()
    )
  `;

  db.query(insertProducto, [categoria, nombre, descripcion, costo], (err, result) => {
    if (err) {
      console.error("❌ Error al guardar producto:", err);
      return res.status(500).json({ mensaje: "Error al guardar producto" });
    }

    const nuevoIdProducto = result.insertId;

    // Si es planta, registrar
    if (categoria.toLowerCase().includes("planta")) {
      const insertPlanta = `
        INSERT INTO Planta (idProducto, nombre, tipo, estado, fecha_siembra, ubicacion)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(insertPlanta, [nuevoIdProducto, nombre, tipo, estado, fecha_siembra, ubicacion]);
    }

    // Sumar stock en entrada
    const agregarStock = `
      UPDATE Producto SET stock = stock + ?
      WHERE idProducto = ?
    `;

    db.query(agregarStock, [cantidad, nuevoIdProducto], () => {

      const insertMovimientoEntrada = `
        INSERT INTO MovimientoInventario (idProducto, tipo, cantidad, fecha, observacion)
        VALUES (?, ?, ?, NOW(), ?)
      `;

      db.query(insertMovimientoEntrada, [nuevoIdProducto, "Entrada", cantidad, descripcion || ""]);

      return res.json({ mensaje: "✔️ Producto registrado con éxito" });
    });
  });
});

//Obtener productos y plantas con precio y descripción combinada
app.get("/api/productos", (req, res) => {
  const query = `
    SELECT 
      p.idProducto AS idProducto,
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

//Endpoint: Login de usuario

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
//Eliminar producto por ID

app.delete("/api/productos/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM Producto WHERE idProducto = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar:", err);
      return res.status(500).json({ mensaje: "Error eliminando producto" });
    }

    return res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

//Editar producto por ID
app.put("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;

  const sql = `
    UPDATE Producto 
    SET nombre = ?, precio = ?
    WHERE idProducto = ?
  `;

  db.query(sql, [nombre, precio, id], (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar: ", err);
      return res.status(500).json({ mensaje: "Error actualizando producto" });
    }

    return res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

// 🚀 ARRANQUE DEL SERVIDOR

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});