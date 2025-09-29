import React from "react";
import '../App.css';

interface Props {
  onBack: () => void;
}

export const ListProd: React.FC<Props> = ({ onBack }) => {
  return (
    <>
      <div>
        <div className="gestion-prod">
          <header className="header">
              <h3>LISTA DE PRODUCTOS</h3>
              <div className="user-section">
                <span>Bienvenido Admin</span>
                <button className="logout-button" onClick={onBack}>Volver</button>
              </div>
            </header>
        </div>
          <div className="d-flex justify-content-start align-items-start gap-3">
            <br />
            <br />
            <table className="table table-striped table-hover table-success" style={{ width: 500 }}>
              <tbody>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Planta</th>
                  <th>Estado</th>
                </tr>
                <tr>
                  <td>56</td>
                  <td>Hortensia</td>
                  <td>En venta</td>
                </tr>
                <tr>
                  <td>58</td>
                  <td>Suculenta</td>
                  <td>En venta</td>
                </tr>
              </tbody>
            </table>
            <br />
            <br />
          </div>
        </div>

        <div className="position-fixed bottom-0 start-0 end-0 p-3 text-center">
          <footer>2025 Creative Commons - Social Software®</footer>
        </div>
        
      

    </>
  );
};