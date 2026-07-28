import { useCart } from '../hooks/useCart.jsx';

export default function ProductCard({ item, stockStatus }) {
  const { addItem, items } = useCart();

  const inCart = items.find(
    (i) => i.nombre === item.nombre && i.categoria === item.categoria
  );
  const disabled = !stockStatus.available;

  const styles = {
    card: {
      background: '#101a1c',
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid rgba(64,206,224,0.15)',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      display: 'flex',
      flexDirection: 'column',
    },
    imageWrap: {
      width: '100%',
      height: 180,
      overflow: 'hidden',
      background: '#162023',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    placeholder: {
      fontSize: 48,
      opacity: 0.3,
    },
    badge: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: '4px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
      background: stockStatus.available ? 'rgba(64,206,224,0.2)' : 'rgba(255,100,100,0.2)',
      color: stockStatus.available ? '#40cee0' : '#ff8888',
      border: stockStatus.available ? '1px solid rgba(64,206,224,0.3)' : '1px solid rgba(255,100,100,0.3)',
    },
    body: {
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    category: {
      fontSize: 11,
      fontWeight: 600,
      color: '#40cee0',
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontFamily: "'Inter', sans-serif",
      marginBottom: 6,
    },
    name: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 18,
      fontWeight: 600,
      color: '#e0eff1',
      margin: '0 0 6px',
      lineHeight: 1.3,
    },
    desc: {
      fontSize: 13,
      color: '#6a8f96',
      fontFamily: "'Inter', sans-serif",
      lineHeight: 1.5,
      flex: 1,
      marginBottom: 14,
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    price: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 18,
      fontWeight: 700,
      color: '#e0eff1',
    },
    button: {
      padding: '8px 18px',
      borderRadius: 8,
      border: 'none',
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? 'rgba(64,206,224,0.08)' : 'rgba(64,206,224,0.15)',
      color: disabled ? '#4a6f75' : '#40cee0',
      transition: 'background 0.2s, color 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    inCart: {
      fontSize: 11,
      color: '#6a8f96',
      fontFamily: "'Inter', sans-serif",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageWrap}>
        {item.imagenBase64 ? (
          <img src={item.imagenBase64} alt={item.nombre} style={styles.image} loading="lazy" />
        ) : (
          <span style={styles.placeholder}>&#x1F372;</span>
        )}
        <span style={styles.badge}>{stockStatus.label}</span>
      </div>
      <div style={styles.body}>
        <div style={styles.category}>{item.categoria}</div>
        <h3 style={styles.name}>{item.nombre}</h3>
        <p style={styles.desc}>{item.descripcion}</p>
        <div style={styles.footer}>
          <span style={styles.price}>{item.precio}</span>
          <button
            style={styles.button}
            disabled={disabled}
            onClick={() => addItem(item)}
          >
            {inCart ? (
              <>&#10003; {inCart.cantidad}</>
            ) : (
              <>Agregar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
