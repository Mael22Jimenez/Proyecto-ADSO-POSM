import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 🔥 Nueva función con conexión al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: username, // Debe coincidir con tu backend
          clave: password,
        }),
      });

      const data = await response.json();

      if (data.login) {
        alert(`✅ Bienvenido ${data.usuario.nombre}`);
        navigate("/home");
      } else {
        alert(`❌ ${data.mensaje}`);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("⚠️ Error al conectar con el servidor");
    }
  };

  // 🎨 Estilos
  const appContainerStyle: React.CSSProperties = {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(to bottom, #FFFDD0 50%, #FFFDD0 50%, #1B2E0C 50%, #1B2E0C 100%)',
    margin: 0,
    padding: 0,
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    position: 'relative',
    boxSizing: 'border-box'
  };

  const loginContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const plantIconStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    backgroundColor: '#B6652C',
    borderRadius: '50%',
    padding: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    fontSize: '24px',
    marginBottom: '-60px',
    border: '1px solid black',
    zIndex: 0,
    position: 'relative'
  };

  const plantEmojiStyle: React.CSSProperties = {
    fontSize: '28px',
    width: '8px',
    filter: 'brightness(0.8)',
    display: 'flex'
  };

  const headerContainerStyle: React.CSSProperties = {
    backgroundColor: '#B6652C',
    width: '320px',
    height: '50px',
    borderRadius: '8px',
    border: '1px solid black',
    padding: '10px 40px',
    marginBottom: '1px',
    boxShadow: '0 8px 6px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
    position: 'relative'
  };

  const headerTitleStyle: React.CSSProperties = {
    color: '#000000',
    fontSize: '28px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    margin: 0,
    textAlign: 'center'
  };

  const loginCardStyle: React.CSSProperties = {
    width: '480px',
    height: '290px',
    backgroundColor: '#556B2F',
    borderRadius: '20px',
    padding: '30px 40px 40px 40px',
    border: '1px solid black',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    marginTop: '-30px',
    paddingTop: '60px'
  };

  const loginFormStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const inputGroupStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputIconStyle: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '5px',
    height: '100%',
    width: '40px',
    borderTopRightRadius: '1px',
    borderBottomRightRadius: '0px',
    margin: '-5px',
    padding: '4px',
    backgroundColor: '#B6652C',
    border: '1px solid black',
    top: '5px',
    left: '41px',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    color: '#2D4A1A',
    opacity: 0.8
  };

  const inputIconImageStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    objectFit: 'contain'
  };

  const inputFieldStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#D9903D',
    borderRadius: '6px',
    padding: '14px 16px 14px 45px',
    border: '1px solid black',
    marginLeft: '36px',
    fontSize: '14px',
    color: '#2D4A1A',
    outline: 'none',
    boxSizing: 'border-box',
    fontWeight: '500',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
  };

  const forgotPasswordStyle: React.CSSProperties = {
    textAlign: 'right',
    marginTop: '8px',
    marginBottom: '10px'
  };

  const forgotLinkStyle: React.CSSProperties = {
    color: '#F5F5DC',
    fontSize: '10px',
    letterSpacing: '1.5px',
    textDecorationLine: 'underline',
    textDecoration: 'underline',
    cursor: 'pointer',
    opacity: 0.7
  };

  const loginButtonStyle: React.CSSProperties = {
    backgroundColor: '#B6652C',
    color: '#000000',
    borderRadius: '6px',
    padding: '14px 30px',
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    cursor: 'pointer',
    border: '1px solid black',
    marginTop: '-10px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    textTransform: 'uppercase',
    alignSelf: 'center',
    minWidth: '100px'
  };

  return (
    <div style={appContainerStyle}>
      <div style={loginContainerStyle}>
        {/* Ícono circular */}
        <div style={plantIconStyle}>
          <span style={plantEmojiStyle}>
            <img
              src="/public/icon_login.png"
              alt="Planta"
              style={{ width: '80px', height: '50px', marginLeft: '-20px', marginTop: '10px', opacity: 0.6 } as React.CSSProperties}
            />
          </span>
        </div>

        <div style={headerContainerStyle}>
          <h1 style={headerTitleStyle}>INICIAR SESIÓN</h1>
        </div>

        <div style={loginCardStyle}>
          <form style={loginFormStyle} onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
              <div style={inputIconStyle}>
                <img src="/public/icon_user.png" alt="Usuario" style={inputIconImageStyle} />
              </div>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputFieldStyle}
              />
            </div>

            <div style={inputGroupStyle}>
              <div style={inputIconStyle}>
                <img src="/public/icon_cont.png" alt="Contraseña" style={inputIconImageStyle} />
              </div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputFieldStyle}
              />
            </div>

            <div style={forgotPasswordStyle}>
              <a
                href="#"
                style={forgotLinkStyle}
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Forgot password');
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.opacity = '0.9';
                }}
              >
                Olvidé la contraseña
              </a>
            </div>

            <button
              type="submit"
              style={loginButtonStyle}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = '#D4956B';
                target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.backgroundColor = '#B8713A';
                target.style.transform = 'translateY(0px)';
              }}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>

      <style>{`
        input::placeholder {
          color: #070606 !important;
          opacity: 0.5 !important;
        }
        input:focus::placeholder {
          opacity: 0.5 !important;
        }
      `}</style>
    </div>
  );
}

export default App;