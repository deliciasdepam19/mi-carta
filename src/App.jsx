import { useState, useEffect } from 'react';
import { CartProvider, useCart } from './hooks/useCart.jsx';
import { useCatalogo } from './hooks/useCatalogo.js';
import { useAuth } from './hooks/useAuth.js';
import Hero from './components/Hero.jsx';
import Nav from './components/Nav.jsx';
import CategoriaSection from './components/CategoriaSection.jsx';
import CartModal from './components/CartModal.jsx';
import AuthOverlay from './components/AuthOverlay.jsx';
import Toast from './components/Toast.jsx';
import './App.css';

const URL_SERVIDOR = import.meta.env.VITE_API_URL || '';

function AppInner() {
  const { data, loading, error } = useCatalogo();
  const { user, login, logout, showOverlay, setShowOverlay } = useAuth();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [abierta, setAbierta] = useState(true);

  useEffect(() => {
    if (!URL_SERVIDOR) return;
    fetch(URL_SERVIDOR + '/api/estado')
      .then(r => r.json())
      .then(d => setAbierta(d.abierta !== false))
      .catch(() => setAbierta(true));
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Cargando menú...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <p style={{ color: '#ff8888' }}>Error al cargar el catálogo</p>
        <p style={{ color: '#6a8f96', fontSize: 13 }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="top-bar">
        <div className="top-bar-left">
          <span className="brand-name">{data?.nombre || 'Delicias de Pam'}</span>
        </div>
        <div className="top-bar-right">
          {user ? (
            <div className="user-chip" title={user.email}>
              {user.picture ? (
                <img src={user.picture} alt="" className="user-avatar" />
              ) : (
                <span className="user-avatar-placeholder">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
              <span className="user-name">{user.name?.split(' ')[0]}</span>
              <button className="logout-btn" onClick={logout} title="Cerrar sesión">
                &times;
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={login}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      <Hero data={data} abierta={abierta} />
      <Nav categorias={data?.categorias} />

      <main className="catalog">
        {data?.categorias.map((cat) => (
          <CategoriaSection
            key={cat.nombre}
            categoria={cat}
            items={data.items}
            catalogo={data}
            abierta={abierta}
          />
        ))}
        {(!data?.categorias || data.categorias.length === 0) && (
          <p className="no-items">No hay categorías disponibles</p>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} {data?.nombre || 'Delicias de Pam'}</p>
      </footer>

      <button
        className={`floating-cart ${cartOpen ? 'active' : ''}`}
        onClick={() => setCartOpen(!cartOpen)}
        aria-label="Carrito"
      >
        &#x1F6D2;
        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
      </button>

      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <AuthOverlay show={showOverlay} onClose={() => setShowOverlay(false)} />

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}
