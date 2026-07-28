import ProductCard from './ProductCard.jsx';
import { useStock } from '../hooks/useStock.js';

export default function CategoriaSection({ categoria, items, catalogo }) {
  const { getStockStatus } = useStock(catalogo);
  const id = categoria.nombre.toLowerCase().replace(/\s+/g, '-');
  const catItems = items.filter((i) => i.categoria === categoria.nombre);

  if (catItems.length === 0) return null;

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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 24,
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
      <div style={styles.grid}>
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
