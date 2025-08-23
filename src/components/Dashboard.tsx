import React, { useState } from 'react';
import './Dashboard.css';
import '../App.css';
import graficoVida from '../assets/CicloPlanta.png';
import graficoCaja from '../assets/EstadoCaja.png';

interface Props {
  onBack: () => void;
}

const Dashboard: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'vida' | 'caja'>('vida');

  return (
      <div className="dashboard">
        <header className="header">
          <h3>VISOR DE MÉTRICAS</h3>
          <div className="user-section">
            <span>Bienvenido Admin</span>
            <button className="logout-button" onClick={onBack}>Volver</button>
          </div>
        </header>

        <div className="tabs">
          <button
            className={activeTab === 'vida' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('vida')}
          >
            Ciclo de vida planta
          </button>
          <button
            className={activeTab === 'caja' ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab('caja')}
          >
            Estado de caja
          </button>
        </div>

        <div className="dashboard-content">
          <div className="chart-container">
            {activeTab === 'vida' ? (
              <img src={graficoVida} alt="Ciclo de vida de la planta" className="chart-image" />
            ) : (
              <img src={graficoCaja} alt="Estado de caja" className="chart-image" />
            )}
            <button className="refresh-button">👤</button>
          </div>
          <div className="side-menu">
            <div className="dropdown">
              <label>{activeTab === 'vida' ? 'Tipo de planta' : 'Mes'}</label>
              <select>
                {activeTab === 'vida' ? (
                  <>
                    <option>Selecciona...</option>
                    <option>Orquidea</option>
                    <option>Girasol</option>
                  </>
                ) : (
                  <>
                    <option>Selecciona...</option>
                    <option>Enero</option>
                    <option>Febrero</option>
                    <option>Marzo</option>
                    <option>Abril</option>
                    <option>Mayo</option>
                    <option>Junio</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;