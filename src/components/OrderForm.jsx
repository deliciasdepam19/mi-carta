import { useState } from 'react';
import { useCart } from '../hooks/useCart.jsx';
import { URL_SERVIDOR } from '../config.js';

export default function OrderForm({ onBack, onSuccess }) {
  const { items, totalFormatted } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    cliente: '',
    telefono: '',
    fecha_entrega: '',
  });

  const hasAnticipado = items.some((i) => i.categoria === 'Repostería');

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.precio.replace(/[^0-9]/g, ''));
    return sum + price * item.cantidad;
  }, 0);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.cliente.trim() || !form.telefono.trim()) {
      setError('Nombre y teléfono son obligatorios');
      return;
    }

    setSubmitting(true);
    setError('');

    const detalle = items
      .map((i) => `${i.cantidad}x ${i.nombre} (${i.categoria})`)
      .join(', ');

    const body = {
      cliente: form.cliente.trim(),
      telefono: form.telefono.trim(),
      detalle,
      total,
      items: items.map((i) => ({
        nombre: i.nombre,
        categoria: i.categoria,
        cantidad: i.cantidad,
      })),
      tipoPago: 'EFECTIVO',
      fecha_entrega: form.fecha_entrega || new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetch(`${URL_SERVIDOR}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Error al enviar pedido');

      const data = await res.json();
      onSuccess({
        numero: data.id || data.numero || Math.floor(Math.random() * 9000 + 1000),
        items,
        total: totalFormatted,
        cliente: form.cliente.trim(),
        telefono: form.telefono.trim(),
      });
    } catch (err) {
      setError(err.message || 'Error al enviar pedido');
    } finally {
      setSubmitting(false);
    }
  }

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 210,
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
      padding: '28px 24px 24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 22,
      fontWeight: 600,
      color: '#e0eff1',
      margin: '0 0 20px',
    },
    label: {
      display: 'block',
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
      color: '#6a8f96',
      marginBottom: 6,
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: 10,
      border: '1px solid rgba(64,206,224,0.2)',
      background: '#162023',
      color: '#e0eff1',
      fontSize: 14,
      fontFamily: "'Inter', sans-serif",
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: 16,
      transition: 'border-color 0.2s',
    },
    summary: {
      background: '#162023',
      borderRadius: 10,
      padding: '14px 16px',
      marginBottom: 20,
      border: '1px solid rgba(64,206,224,0.1)',
    },
    summaryTitle: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
      color: '#6a8f96',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10,
    },
    summaryItem: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
      color: '#e0eff1',
      marginBottom: 4,
      display: 'flex',
      justifyContent: 'space-between',
    },
    summaryTotal: {
      borderTop: '1px solid rgba(64,206,224,0.15)',
      marginTop: 8,
      paddingTop: 8,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: "'Inter', sans-serif",
      fontSize: 15,
      fontWeight: 700,
      color: '#40cee0',
    },
    error: {
      color: '#ff8888',
      fontSize: 13,
      fontFamily: "'Inter', sans-serif",
      marginBottom: 12,
    },
    actions: {
      display: 'flex',
      gap: 10,
    },
    backBtn: {
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
    submitBtn: {
      flex: 1,
      padding: '12px',
      borderRadius: 10,
      border: 'none',
      background: '#40cee0',
      color: '#09100f',
      fontSize: 14,
      fontWeight: 600,
      cursor: submitting ? 'not-allowed' : 'pointer',
      fontFamily: "'Inter', sans-serif",
      opacity: submitting ? 0.6 : 1,
    },
  };

  return (
    <div style={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onBack(); }}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Completar Pedido</h2>

        <div style={styles.summary}>
          <div style={styles.summaryTitle}>Resumen</div>
          {items.map((item, idx) => (
            <div key={idx} style={styles.summaryItem}>
              <span>{item.cantidad}x {item.nombre}</span>
              <span>
                ${(
                  parseFloat(item.precio.replace(/[^0-9]/g, '')) * item.cantidad
                ).toLocaleString('es-CL')}
              </span>
            </div>
          ))}
          <div style={styles.summaryTotal}>
            <span>Total</span>
            <span>{totalFormatted}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Nombre</label>
          <input
            name="cliente"
            style={styles.input}
            value={form.cliente}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />

          <label style={styles.label}>Teléfono</label>
          <input
            name="telefono"
            style={styles.input}
            value={form.telefono}
            onChange={handleChange}
            placeholder="+56 9 1234 5678"
            required
          />

          {hasAnticipado && (
            <>
              <label style={styles.label}>Fecha de entrega</label>
              <input
                type="date"
                name="fecha_entrega"
                style={styles.input}
                value={form.fecha_entrega}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.actions}>
            <button type="button" style={styles.backBtn} onClick={onBack}>
              Volver
            </button>
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
