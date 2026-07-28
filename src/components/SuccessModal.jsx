import { WHATSAPP_NUMBER } from '../config.js';

export default function SuccessModal({ result, onClose }) {
  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 220,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
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
      maxWidth: 440,
      padding: '32px 24px 24px',
      textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    icon: {
      fontSize: 64,
      marginBottom: 16,
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 24,
      fontWeight: 600,
      color: '#e0eff1',
      margin: '0 0 8px',
    },
    orderNum: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      color: '#40cee0',
      fontWeight: 600,
      marginBottom: 20,
    },
    detail: {
      background: '#162023',
      borderRadius: 10,
      padding: '14px 16px',
      marginBottom: 24,
      textAlign: 'left',
      border: '1px solid rgba(64,206,224,0.1)',
    },
    detailLabel: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
      color: '#6a8f96',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 8,
    },
    detailRow: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
      color: '#e0eff1',
      marginBottom: 4,
      display: 'flex',
      justifyContent: 'space-between',
    },
    detailTotal: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 15,
      fontWeight: 700,
      color: '#40cee0',
      borderTop: '1px solid rgba(64,206,224,0.15)',
      marginTop: 8,
      paddingTop: 8,
      display: 'flex',
      justifyContent: 'space-between',
    },
    whatsappBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '14px 28px',
      borderRadius: 12,
      border: 'none',
      background: '#25D366',
      color: '#fff',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: "'Inter', sans-serif",
      marginBottom: 12,
    },
    closeBtn: {
      display: 'block',
      width: '100%',
      padding: '12px',
      borderRadius: 10,
      border: '1px solid rgba(64,206,224,0.2)',
      background: 'transparent',
      color: '#6a8f96',
      fontSize: 14,
      fontWeight: 500,
      cursor: 'pointer',
      fontFamily: "'Inter', sans-serif",
    },
  };

  function openWhatsApp() {
    const itemsText = result.items
      .map((i) => `${i.cantidad}x ${i.nombre}`)
      .join(', ');
    const msg = `Hola! Quiero confirmar mi pedido #${result.numero}:\n${itemsText}\nTotal: ${result.total}\nNombre: ${result.cliente}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  }

  return (
    <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={styles.modal}>
        <div style={styles.icon}>&#x2705;</div>
        <h2 style={styles.title}>Pedido Recibido</h2>
        <p style={styles.orderNum}>Pedido #{result.numero}</p>

        <div style={styles.detail}>
          <div style={styles.detailLabel}>Detalle</div>
          {result.items.map((item, idx) => (
            <div key={idx} style={styles.detailRow}>
              <span>{item.cantidad}x {item.nombre}</span>
              <span>{item.precio}</span>
            </div>
          ))}
          <div style={styles.detailTotal}>
            <span>Total</span>
            <span>{result.total}</span>
          </div>
        </div>

        <button style={styles.whatsappBtn} onClick={openWhatsApp}>
          Confirmar por WhatsApp
        </button>
        <button style={styles.closeBtn} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
