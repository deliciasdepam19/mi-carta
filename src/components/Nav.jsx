import { useEffect, useState } from 'react';

export default function Nav({ categorias }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);

      const sections = document.querySelectorAll('[data-category]');
      let current = '';
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 120) current = sec.getAttribute('data-category');
      });
      setActive(current);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const styles = {
    nav: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: scrolled ? 'rgba(9,16,15,0.85)' : 'rgba(9,16,15,0.95)',
      backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
      borderBottom: '1px solid rgba(64,206,224,0.15)',
      transition: 'background 0.3s, backdrop-filter 0.3s',
      padding: '0 24px',
    },
    container: {
      maxWidth: 900,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'center',
      gap: 4,
      overflowX: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },
    link: (isActive) => ({
      display: 'inline-block',
      padding: '14px 20px',
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      fontWeight: isActive ? 600 : 400,
      color: isActive ? '#40cee0' : '#6a8f96',
      textDecoration: 'none',
      borderBottom: isActive ? '2px solid #40cee0' : '2px solid transparent',
      whiteSpace: 'nowrap',
      transition: 'color 0.2s, border-color 0.2s',
    }),
  };

  if (!categorias || categorias.length === 0) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {categorias.map((cat) => {
          const id = cat.nombre.toLowerCase().replace(/\s+/g, '-');
          return (
            <a
              key={cat.nombre}
              href={`#${id}`}
              style={styles.link(active === cat.nombre)}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {cat.nombre}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
