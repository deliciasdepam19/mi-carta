import { useEffect, useRef } from 'react';

export default function AuthOverlay({ show, onClose }) {
  const btnRef = useRef(null);

  useEffect(() => {
    if (!show || !window.google) return;

    const timer = setTimeout(() => {
      if (btnRef.current) {
        window.google.accounts.id.renderButton(btnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: 280,
          text: 'signin_with',
          shape: 'pill',
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    modal: {
      background: '#101a1c',
      borderRadius: 20,
      border: '1px solid rgba(64,206,224,0.2)',
      width: '100%',
      maxWidth: 380,
      padding: '32px 24px',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    icon: {
      fontSize: 48,
      marginBottom: 16,
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 22,
      fontWeight: 600,
      color: '#e0eff1',
      margin: '0 0 8px',
    },
    subtitle: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      color: '#6a8f96',
      marginBottom: 24,
    },
    buttonWrap: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 16,
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: '#6a8f96',
      fontSize: 14,
      cursor: 'pointer',
      fontFamily: "'Inter', sans-serif",
    },
  };

  return (
    <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={styles.modal}>
        <div style={styles.icon}>&#x1F464;</div>
        <h2 style={styles.title}>Iniciar Sesión</h2>
        <p style={styles.subtitle}>
          Conectate con Google para guardar tus pedidos y recibir novedades
        </p>
        <div style={styles.buttonWrap}>
          <div ref={btnRef}></div>
        </div>
        <button style={styles.closeBtn} onClick={onClose}>
          Continuar como invitado
        </button>
      </div>
    </div>
  );
}
