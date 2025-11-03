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
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

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

  // Manejar cambios en el formulario
  const handleProductoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [id]: value });
  };

  // Función para crear producto o planta
  const crearProducto = async () => {
    if (!nuevoProducto.nombre || !categoriaSeleccionada) {
      alert("Por favor completa los campos requeridos.");
      return;
    }

    const datos = {
      categoria: categoriaSeleccionada,
      nombre: nuevoProducto.nombre,
      tipo: nuevoProducto.tipo,
      estado: nuevoProducto.estado,
      fecha_siembra: nuevoProducto.fecha_siembra || null,
      ubicacion: nuevoProducto.ubicacion,
      costo: nuevoProducto.costo,
      descripcion: nuevoProducto.descripcion,
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

      {/* Selección de categoría */}
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

      {/* Formulario dinámico según la categoría */}
      {categoriaSeleccionada && (
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
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Estado</span>
                <select
                  id="estado"
                  className="form-select"
                  value={nuevoProducto.estado}
                  onChange={handleProductoChange}
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

              <button type="button" className="reusable-button p-2 mt-3" onClick={crearProducto}>
                Registrar Planta
              </button>
            </form>
          ) : (
            // 📦 Formulario de producto general
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
                <span className="input-group-text">Descripción</span>
                <textarea
                  id="descripcion"
                  className="form-control"
                  value={nuevoProducto.descripcion}
                  onChange={handleProductoChange}
                  rows={2}
                ></textarea>
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