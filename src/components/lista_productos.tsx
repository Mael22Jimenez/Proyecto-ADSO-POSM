import React, { useEffect, useState } from "react";
import "./Dashboard.css";

interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
}
interface Props {
  onBack: () => void;
}
const ListaProductos: React.FC<Props> = ({ onBack }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");

  // 🔹 Cargar lista de productos desde el backend
  useEffect(() => {
    fetch("http://localhost:3305/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("❌ Error al cargar productos:", err));
  }, []);

  // 🔍 Filtrar productos por nombre o categoría
  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="lista-prod-container">
      <header className="header">
        <button className="reusable-button mb-3" onClick={onBack}>
          ⬅️ Volver
        </button>
        <h3>📋 LISTA DE PRODUCTOS</h3>
      </header>

      <div className="busqueda-container mt-3 mb-3" style={{ width: "50%" }}>
        <input
          type="text"
          className="form-control"
          placeholder="🔎 Buscar por nombre o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla de productos */}
      <table className="table table-bordered table-hover">
        <thead className="text-center table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((p) => (
              <tr key={p.idProducto}>
                <td className="text-center">{p.idProducto}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.descripcion || "—"}</td>
                <td className="text-end">${p.precio?.toLocaleString()}</td>
                <td className="text-center">{p.stock}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No se encontraron productos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProductos;