import React, { useState } from 'react';
import './Dashboard.css';

interface Props {
  onBack: () => void;
}

const GestionProductos: React.FC<Props> = ({ onBack }) => {
  // Lista de productos
  const [productos, setProductos] = useState([
    { id: 56, especie: "Hortensia", siembra: "9/9/2025", fase: "Semillero", estado: "Plántula", costo: 5000, stock: 0 },
    { id: 58, especie: "Orquídea Morada", siembra: "10/9/2025", fase: "Crecimiento", estado: "Saludable", costo: 8000, stock: 0 },
  ]);

  // Movimientos
  const [movimientos, setMovimientos] = useState<{producto: number, tipo: string, cantidad: number, proveedor: string, fecha: string}[]>([]);

  // Formularios
  const [nuevoProducto, setNuevoProducto] = useState({ id: "", especie: "", siembra: "", fase: "", estado: "", costo: "" });
  const [movimiento, setMovimiento] = useState({ producto: "", tipo: "entrada", cantidad: 0, proveedor: "" });

  // Manejo de cambios
  const handleProductoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [id]: value });
  };

  const handleMovimientoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setMovimiento({ ...movimiento, [id]: value });
  };

  // Crear producto
  const crearProducto = () => {
    if (!nuevoProducto.id || !nuevoProducto.especie) return;
    const nuevo = {
      id: parseInt(nuevoProducto.id),
      especie: nuevoProducto.especie,
      siembra: nuevoProducto.siembra,
      fase: nuevoProducto.fase,
      estado: nuevoProducto.estado,
      costo: parseInt(nuevoProducto.costo),
      stock: 0
    };
    setProductos([...productos, nuevo]);
    setNuevoProducto({ id: "", especie: "", siembra: "", fase: "", estado: "", costo: "" });
  };

  // Registrar movimiento
  const registrarMovimiento = () => {
    const productoIndex = productos.findIndex(p => p.id === parseInt(movimiento.producto));
    if (productoIndex !== -1) {
      const nuevosProductos = [...productos];
      if (movimiento.tipo === "entrada") {
        nuevosProductos[productoIndex].stock += parseInt(movimiento.cantidad.toString());
      } else {
        nuevosProductos[productoIndex].stock -= parseInt(movimiento.cantidad.toString());
      }
      setProductos(nuevosProductos);

      setMovimientos([...movimientos, { 
        producto: parseInt(movimiento.producto), 
        tipo: movimiento.tipo, 
        cantidad: parseInt(movimiento.cantidad.toString()), 
        proveedor: movimiento.proveedor,
        fecha: new Date().toLocaleDateString() 
      }]);

      setMovimiento({ producto: "", tipo: "entrada", cantidad: 0, proveedor: "" });
    }
  };

  return (
    <div>
      <div className="gestion-prod">
        <header className="header">
          <h3>GESTIÓN DE PRODUCTOS</h3>
          <div className="user-section">
            <span>Bienvenido Admin</span>
            <button className="logout-button" onClick={onBack}>Volver</button>
          </div>
        </header>
      </div>

      <br />
      <div className="d-flex justify-content-start align-items-start gap-5">
        
        {/* Formulario crear producto */}
        <form className="w-50">
          <h5>Crear Producto</h5>

          <div className="input-group mb-3">
            <span className="input-group-text">ID Planta</span>
            <input type="text" id="id" className="form-control" value={nuevoProducto.id} onChange={handleProductoChange}/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Especie</span>
            <input type="text" id="especie" className="form-control" value={nuevoProducto.especie} onChange={handleProductoChange}/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Siembra</span>
            <input type="text" id="siembra" className="form-control" value={nuevoProducto.siembra} onChange={handleProductoChange}/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Fase</span>
            <input type="text" id="fase" className="form-control" value={nuevoProducto.fase} onChange={handleProductoChange}/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Estado</span>
            <input type="text" id="estado" className="form-control" value={nuevoProducto.estado} onChange={handleProductoChange}/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Costo</span>
            <input type="text" id="costo" className="form-control" value={nuevoProducto.costo} onChange={handleProductoChange}/>
          </div>

          <button type="button" className="reusable-button p-2 mt-3" onClick={crearProducto}>Crear producto</button>
        </form>

        {/* Formulario registrar movimiento */}
        <form className="w-50">
          <h5>Registrar Movimiento</h5>

          <div className="input-group mb-3">
            <span className="input-group-text">Producto</span>
            <select id="producto" className="form-select" value={movimiento.producto} onChange={handleMovimientoChange}>
              <option value="">Seleccione un producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.especie}</option>
              ))}
            </select>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Tipo</span>
            <select id="tipo" className="form-select" value={movimiento.tipo} onChange={handleMovimientoChange}>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Cantidad</span>
            <input type="number" id="cantidad" className="form-control" value={movimiento.cantidad} onChange={handleMovimientoChange}/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Proveedor</span>
            <input type="text" id="proveedor" className="form-control" value={movimiento.proveedor} onChange={handleMovimientoChange}/>
          </div>

          <button type="button" className="reusable-button p-2 mt-3" onClick={registrarMovimiento}>Registrar Movimiento</button>
        </form>
      </div>

      <br />

      {/* Historial de movimientos */}
      <h5>Historial de Movimientos</h5>
      <table className="table table-bordered table-hover" style={{ width: "100%" }}>
        <thead>
          <tr className="text-center">
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Proveedor</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m, index) => (
            <tr key={index}>
              <td>{productos.find(p => p.id === m.producto)?.especie}</td>
              <td>{m.tipo}</td>
              <td>{m.cantidad}</td>
              <td>{m.proveedor}</td>
              <td>{m.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionProductos;