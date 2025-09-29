import React from 'react';
import './Dashboard.css';


interface Props {
  onBack: () => void;
}

const GestionProductos: React.FC<Props> = ({ onBack }) => {
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
      <br />
      <div className="d-flex justify-content-start align-items-start gap-3">

        <form className="w-50">

          <div className="input-group mb-3">
            <span className="input-group-text " id="inputGroup-sizing-default">ID Planta</span>
            <input type="text" id="id_planta" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">Especie</span>
            <input type="text" id="especie" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">Siembra</span>
            <input type="text" id="siembra" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">Fase</span>
            <input type="text" id="fase" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">Estado</span>
            <input type="text" id="estado" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">Costo</span>
            <input type="text" id="costo" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
          </div>

          <button type="button" className="reusable-button p-2 mt-3">Crear producto</button>
        </form>
    
        <br />
        <br />

        <br />
        <br />

        <table className="table table-striped table-hover table-success" style={{ width: 500 }}>
          <thead>
            <tr className="text-center">
              <th>ID Planta</th>
              <th>Especie</th>
              <th>Siembra</th>
              <th>Fase</th>
              <th>Estado</th>
              <th>Costo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>56</td>
              <td>Hortensia</td>
              <td>9/9/2025</td>
              <td>Semillero</td>
              <td>Plántula</td>
              <td>5000</td>
              <td className="d-flex gap-2">
                <button type="button" className="btn btn-danger mb-3">Eliminar</button> 
                <button type="button" className="btn btn-success mb-3">Editar</button>
              </td>
            </tr>
            <tr>
              <td>58</td>
              <td colSpan={5}>Información pendiente</td>
              <td className="d-flex gap-2">
                <button type="button" className="btn btn-danger mb-3">Eliminar</button>
                <button type="button" className="btn btn-success mb-3">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionProductos;