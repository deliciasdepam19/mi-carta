import ProductCard from './ProductCard.jsx';
import { useStock } from '../hooks/useStock.js';
import { useHorarios } from '../hooks/useHorarios.js';

export default function CategoriaSection({ categoria, items, catalogo }) {
  const { getStockStatus } = useStock(catalogo);
  const { getEstadoCategoria } = useHorarios();
  const id = categoria.nombre.toLowerCase().replace(/\s+/g, '-');
  const catItems = items.filter((i) => i.categoria === categoria.nombre);
  if (catItems.length === 0) return null;

  const estadoHorario = getEstadoCategoria(categoria.nombre);
  // Mientras no cargue /api/horarios, no bloqueamos (evita parpadeo); el backend
  // igual va a rechazar el pedido si de verdad está fuera de horario.
  const fueraDeHorario = estadoHorario ? !estadoHorario.disponible : false;

  const styles = {
    section: {
      padding: '48px 24px',
      maxWidth: 1100,
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 28,
    },
    icon: {
      fontSize: 28,
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 28,
      fontWeight: 600,
      color: '#e0eff1',
      margin: 0,
    },
    count: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
      color: '#6a8f96',
      marginLeft: 'auto',
    },
    banner: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
      color: '#ffb37a',
      backgroundColor: 'rgba(255,179,122,0.1)',
      border: '1px solid rgba(255,179,122,0.25)',
      borderRadius: 10,
      padding: '10px 14px',
      marginBottom: 20,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 24,
      opacity: fueraDeHorario ? 0.45 : 1,
      pointerEvents: fueraDeHorario ? 'none' : 'auto',
      filter: fueraDeHorario ? 'grayscale(40%)' : 'none',
      transition: 'opacity 0.2s ease',
    },
  };

  const icons = {
    'Empanadas': '\uD83E\uDD5F',
    'Panadería': '\uD83C\uDF5E',
    'Repostería': '\uD83C\uDF70',
  };

  return (
    <section id={id} data-category={categoria.nombre} style={styles.section}>
      <div style={styles.header}>
        <span style={styles.icon}>{icons[categoria.nombre] || '\uD83C\uDF7D\uFE0F'}</span>
        <h2 style={styles.title}>{categoria.nombre}</h2>
        <span style={styles.count}>{catItems.length} productos</span>
      </div>

      {fueraDeHorario && (
        <p style={styles.banner} role="status">
          {estadoHorario.desde && estadoHorario.hasta
            ? `Fuera de horario — disponible de ${estadoHorario.desde} a ${estadoHorario.hasta}`
            : 'Pedidos cerrados por ahora'}
        </p>
      )}

      <div style={styles.grid} aria-disabled={fueraDeHorario}>
        {catItems.map((item, idx) => (
          <ProductCard
            key={`${item.nombre}-${idx}`}
            item={item}
            stockStatus={getStockStatus(item)}
          />
        ))}
      </div>
    </section>
  );
}
