import React, { useState, useEffect } from "react";
import "./Dashboard.css";

interface Props {
  onBack: () => void;
}

interface Categoria {
  idCategoria: number;
  nombre: string;
}

const GestionProductos: React.FC<Props> = ({ onBack }) => {
  // Estado para categorías
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const productosFiltrados = productos.filter(
    (p) => p.categoria === categoriaSeleccionada
  );

  // Estado para el formulario de producto/planta
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    tipo: "",
    estado: "Semilla",
    fecha_siembra: "",
    ubicacion: "",
    costo: "",
    descripcion: "",
  });

  // Cargar categorías desde el backend al iniciar
  useEffect(() => {
    fetch("http://localhost:3305/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("❌ Error al cargar categorías:", err));
  }, []);

  // Cargar productos para las salidas
  useEffect(() => {
    fetch("http://localhost:3305/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("❌ Error al cargar productos:", err));
  }, []);

  // Manejar cambios en el formulario
  const handleProductoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [id]: value });
  };
    const handleSeleccionProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setProductoSeleccionado(id);

    const prod = productos.find((p) => p.idProducto == id);
    if (!prod) return;

    setNuevoProducto({
      nombre: prod.nombre,
      tipo: prod.tipo || "",
      estado: prod.estado || "Semilla",
      fecha_siembra: prod.fecha_siembra || "",
      ubicacion: prod.ubicacion || "",
      costo: prod.precio,
      descripcion: "",
    });
  };

  // Función para crear producto o planta
  const crearProducto = async () => {
    if (!nuevoProducto.nombre || !categoriaSeleccionada) {
      alert("Por favor completa los campos requeridos.");
      return;
    }
    // Validar cantidad
    if (!cantidad || parseInt(cantidad) <= 0) {
    alert("Debe ingresar una cantidad válida.");
    return;
    }

    const datos = {
      idProducto: productoSeleccionado,
      categoria: categoriaSeleccionada,
      nombre: nuevoProducto.nombre,
      tipo: nuevoProducto.tipo,
      estado: nuevoProducto.estado,
      fecha_siembra: nuevoProducto.fecha_siembra || null,
      ubicacion: nuevoProducto.ubicacion,
      costo: nuevoProducto.costo,
      descripcion: nuevoProducto.descripcion,
      tipoMovimiento: tipoMovimiento,
      cantidad: cantidad,
    };

    try {
      const response = await fetch("http://localhost:3305/api/guardar-producto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.mensaje || "Registro exitoso ✅");
        setNuevoProducto({
          nombre: "",
          tipo: "",
          estado: "Semilla",
          fecha_siembra: "",
          ubicacion: "",
          costo: "",
          descripcion: "",
        });
      } else {
        alert(result.mensaje || "Error al registrar el producto ❌");
      }
    } catch (error) {
      console.error("❌ Error al guardar el producto:", error);
      alert("Error al guardar el producto. Revisa la conexión con el servidor.");
    }
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="gestion-prod">
        <header className="header">
          <h3>GESTIÓN DE PRODUCTOS</h3>
          <div className="user-section">
            <span>Bienvenido Admin</span>
            <button className="logout-button" onClick={onBack}>
              Volver
            </button>
          </div>
        </header>
      </div>

      <br />
      {/* Selección de tipo de movimiento */}
      <div className="input-group mb-4" style={{ width: "50%" }}>
        <span className="input-group-text">Movimiento</span>
        <select
          className="form-select"
          value={tipoMovimiento}
          onChange={(e) => setTipoMovimiento(e.target.value)}
        >
          <option value="">Seleccione un tipo de movimiento</option>
          <option value="Entrada">Entrada (sumar stock)</option>
          <option value="Salida">Salida (restar stock)</option>
        </select>
      </div>
      {/* Selección de categoría */}
      {tipoMovimiento && (
        <div className="input-group mb-4" style={{ width: "50%" }}>
          <span className="input-group-text">Categoría</span>
          <select
            className="form-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((c) => (
              <option key={c.idCategoria} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* Mostrar solo si es salida */}
      {tipoMovimiento === "Salida" && (
        <div className="input-group mb-4" style={{ width: "50%" }}>
          <span className="input-group-text">Producto</span>
          <select
            className="form-select"
            value={productoSeleccionado}
            onChange={handleSeleccionProducto}
          >
            <option value="">Seleccione un producto</option>
            {productosFiltrados.map((p) => (
              <option key={p.idProducto} value={p.idProducto}>
                {p.nombre} (Stock: {p.stock})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Formulario dinámico según la categoría */}
      {tipoMovimiento && categoriaSeleccionada && (
          <div className="d-flex justify-content-start align-items-start gap-5">
            {categoriaSeleccionada.toLowerCase().includes("planta") ? (
            // 🌱 Formulario de planta
            <form className="w-50">
              <h5>Registrar Planta</h5>

              <div className="input-group mb-3">
                <span className="input-group-text">Nombre</span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  value={nuevoProducto.nombre}
                  onChange={handleProductoChange}
                  readOnly={tipoMovimiento === "Salida"} //Bloqueo si es salida
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Tipo</span>
                <input
                  type="text"
                  id="tipo"
                  className="form-control"
                  value={nuevoProducto.tipo}
                  onChange={handleProductoChange}
                  readOnly={tipoMovimiento === "Salida"} //Bloqueo si es salida
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Estado</span>
                <select
                  id="estado"
                  className="form-select"
                  value={nuevoProducto.estado}
                  onChange={handleProductoChange}
                  disabled={tipoMovimiento === "Salida"} //Bloqueo si es salida
                >
                  <option value="Semilla">Semilla</option>
                  <option value="Crecimiento">Crecimiento</option>
                  <option value="Floración">Floración</option>
                  <option value="Madura">Madura</option>
                </select>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Fecha de Siembra</span>
                <input
                  type="date"
                  id="fecha_siembra"
                  className="form-control"
                  value={nuevoProducto.fecha_siembra}
                  onChange={handleProductoChange}
                  disabled={tipoMovimiento === "Salida"} //Bloqueo si es salida
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Ubicación</span>
                <input
                  type="text"
                  id="ubicacion"
                  className="form-control"
                  value={nuevoProducto.ubicacion}
                  onChange={handleProductoChange}
                  readOnly={tipoMovimiento === "Salida"} //Bloqueo si es salida
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Costo</span>
                <input
                  type="number"
                  id="costo"
                  className="form-control"
                  value={nuevoProducto.costo}
                  onChange={handleProductoChange}
                  readOnly={tipoMovimiento === "Salida"} //Bloqueo si es salida
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Cantidad</span>
                <input
                  type="number"
                  id="cantidad"
                  className="form-control"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>

              <button type="button" className="reusable-button p-2 mt-3" onClick={crearProducto}>
                Registrar Planta
              </button>
            </form>
          ) : (
            // Formulario de producto general
            <form className="w-50">
              <h5>Registrar Producto</h5>

              <div className="input-group mb-3">
                <span className="input-group-text">Nombre</span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  value={nuevoProducto.nombre}
                  onChange={handleProductoChange}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Costo</span>
                <input
                  type="number"
                  id="costo"
                  className="form-control"
                  value={nuevoProducto.costo}
                  onChange={handleProductoChange}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">
                  {tipoMovimiento === "Salida" ? "Motivo de salida" : "Descripción"}
                </span>
                <textarea
                  id="descripcion"
                  className="form-control"
                  value={nuevoProducto.descripcion}
                  onChange={handleProductoChange}
                  rows={2}
                ></textarea>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Cantidad</span>
                <input
                  type="number"
                  id="cantidad"
                  className="form-control"
                  value={cantidad}
                  min="1"
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>

              <button type="button" className="reusable-button p-2 mt-3" onClick={crearProducto}>
                Registrar Producto
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default GestionProductos;