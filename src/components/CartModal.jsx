import { useState } from 'react';
import { useCart } from '../hooks/useCart.jsx';
import OrderForm from './OrderForm.jsx';
import SuccessModal from './SuccessModal.jsx';

export default function CartModal({ isOpen, onClose, abierta }) {
  const { items, totalFormatted, removeItem, updateQuantity, clearCart } = useCart();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const storeOpen = abierta !== false;

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 200,
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
      maxWidth: 480,
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: '1px solid rgba(64,206,224,0.1)',
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 20,
      fontWeight: 600,
      color: '#e0eff1',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: '#6a8f96',
      fontSize: 24,
      cursor: 'pointer',
      padding: '4px 8px',
      lineHeight: 1,
    },
    list: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px 24px',
      minHeight: 100,
    },
    empty: {
      textAlign: 'center',
      padding: 40,
      color: '#6a8f96',
      fontFamily: "'Inter', sans-serif",
      fontSize: 15,
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 0',
      borderBottom: '1px solid rgba(64,206,224,0.08)',
    },
    itemInfo: {
      flex: 1,
      minWidth: 0,
    },
    itemName: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      fontWeight: 500,
      color: '#e0eff1',
      margin: 0,
    },
    itemCat: {
      fontSize: 11,
      color: '#40cee0',
      textTransform: 'uppercase',
      fontFamily: "'Inter', sans-serif",
    },
    qtyControls: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    qtyBtn: {
      width: 28,
      height: 28,
      borderRadius: 6,
      border: '1px solid rgba(64,206,224,0.2)',
      background: 'transparent',
      color: '#40cee0',
      fontSize: 16,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
    },
    qty: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      color: '#e0eff1',
      minWidth: 24,
      textAlign: 'center',
    },
    removeBtn: {
      background: 'none',
      border: 'none',
      color: '#ff8888',
      fontSize: 18,
      cursor: 'pointer',
      padding: 4,
      opacity: 0.6,
    },
    itemPrecio: {
      fontSize: 13,
      fontFamily: "'Inter', sans-serif",
      color: '#6a8f96',
    },
    footer: {
      padding: '16px 24px 24px',
      borderTop: '1px solid rgba(64,206,224,0.1)',
    },
    total: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    totalLabel: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 16,
      fontWeight: 500,
      color: '#e0eff1',
    },
    totalValue: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 20,
      fontWeight: 700,
      color: '#40cee0',
    },
    actions: {
      display: 'flex',
      gap: 10,
    },
    clearBtn: {
      flex: 1,
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
    orderBtn: {
      flex: 1,
      padding: '12px',
      borderRadius: 10,
      border: 'none',
      background: '#40cee0',
      color: '#09100f',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: "'Inter', sans-serif",
    },
  };

  if (showOrderForm && !orderResult) {
    return (
      <OrderForm
        onBack={() => setShowOrderForm(false)}
        onSuccess={(result) => setOrderResult(result)}
        abierta={abierta}
      />
    );
  }

  if (orderResult) {
    return (
      <SuccessModal
        result={orderResult}
        onClose={() => {
          setOrderResult(null);
          setShowOrderForm(false);
          clearCart();
          onClose();
        }}
      />
    );
  }

  return (
    <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            &#x1F6D2; Tu Pedido
          </h2>
          <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>

        <div style={styles.list}>
          {items.length === 0 ? (
            <p style={styles.empty}>No hay productos en tu pedido</p>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.nombre}-${item.categoria}-${idx}`} style={styles.item}>
                <div style={styles.itemInfo}>
                  <div style={styles.itemCat}>{item.categoria}</div>
                  <p style={styles.itemName}>{item.nombre}</p>
                  <span style={styles.itemPrecio}>
                    {item.precio} c/u = ${(
                      parseFloat(item.precio.replace(/[^0-9]/g, '')) * item.cantidad
                    ).toLocaleString('es-CL')}
                  </span>
                </div>
                <div style={styles.qtyControls}>
                  <button
                    style={{...styles.qtyBtn, opacity: storeOpen ? 1 : 0.3, cursor: storeOpen ? 'pointer' : 'not-allowed'}}
                    disabled={!storeOpen}
                    onClick={() => updateQuantity(item.nombre, item.categoria, item.cantidad - 1)}
                  >
                    &minus;
                  </button>
                  <span style={styles.qty}>{item.cantidad}</span>
                  <button
                    style={{...styles.qtyBtn, opacity: storeOpen ? 1 : 0.3, cursor: storeOpen ? 'pointer' : 'not-allowed'}}
                    disabled={!storeOpen}
                    onClick={() => updateQuantity(item.nombre, item.categoria, item.cantidad + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  style={{...styles.removeBtn, opacity: storeOpen ? 0.6 : 0.3, cursor: storeOpen ? 'pointer' : 'not-allowed'}}
                  disabled={!storeOpen}
                  onClick={() => removeItem(item)}
                  title="Quitar"
                >
                  &#x1F5D1;
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={styles.footer}>
            {!storeOpen && (
              <div style={{
                background: 'rgba(255,100,100,0.1)',
                border: '1px solid rgba(255,100,100,0.25)',
                borderRadius: 10,
                padding: '10px 14px',
                marginBottom: 12,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: '#ff8888',
                textAlign: 'center',
              }}>
                &#x26D4; Local cerrado — no se pueden hacer pedidos
              </div>
            )}
            <div style={styles.total}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>{totalFormatted}</span>
            </div>
            <div style={styles.actions}>
              <button style={styles.clearBtn} onClick={clearCart}>
                Vaciar
              </button>
              <button
                style={{
                  ...styles.orderBtn,
                  opacity: storeOpen ? 1 : 0.4,
                  cursor: storeOpen ? 'pointer' : 'not-allowed',
                }}
                disabled={!storeOpen}
                onClick={() => storeOpen && setShowOrderForm(true)}
              >
                Hacer Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
