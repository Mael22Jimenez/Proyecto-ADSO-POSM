import React, { useState } from "react";
import "../App.css";
import imagen1 from '../assets/imagen1.jpg';
import imagen5 from '../assets/imagen5.jpg';
import imagen3 from '../assets/imagen3.jpg';
import imagen6 from '../assets/imagen6.jpg';
import imagen7 from '../assets/imagen7.jpg';
import { useNavigate } from 'react-router-dom';

import GestionProductos from './gestion_productos';
import { ListProd } from './lista_productos';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const [view, setView] = useState<'inicio' | 'gestion' | 'dashboard' | 'lista'>('inicio');

    return (
        <>
            <div style={{ backgroundColor: '#556B2F'}}>    
                <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
                    <div className="container-fluid">
                        <a className="login-title"><h2>Menú principal</h2></a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarText">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="reusable-button" onClick={() => setView('gestion')}>Gestión de productos</a>
                                </li>
                                <li className="nav-item">
                                    <a className="reusable-button" onClick={() => setView('lista')}>Lista de productos</a>
                                </li>
                            </ul>
                            <span className="navbar-text">
                                <button className="btn btn-outline-light" onClick={() => navigate('/')}>
                                    <img src="/public/cerrar-sesion.png" width="20" alt="Cerrar sesión" />
                                </button>
                            </span>
                        </div>
                    </div>
                </nav>

                <div style={{ marginTop: '70px', padding: '20px' }}>
                    {view === 'inicio' && (
                        <div className="carousel-container">
                            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel"  data-bs-interval="2000" >
                                <div className="carousel-indicators">
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
                                </div>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src={imagen1} className="d-block w-100 carousel-image" alt="..." />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={imagen5} className="d-block w-100 carousel-image" alt="..." />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={imagen3} className="d-block w-100 carousel-image" alt="..." />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={imagen6} className="d-block w-100 carousel-image" alt="..." />
                                    </div>
                                    <div className="carousel-item">
                                        <img src={imagen7} className="d-block w-100 carousel-image" alt="..." />
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {view === 'gestion' && (
                        <GestionProductos onBack={() => setView('inicio')} />
                    )}

                    {view === 'lista' && (
                        <ListProd onBack={() => setView('inicio')} />
                    )}
                </div>
            </div>
        </>
    );
};