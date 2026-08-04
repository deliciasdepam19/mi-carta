import { useState, useEffect } from 'react';

// Mapea el nombre de categoría tal como viene del catálogo → clave usada por /api/horarios
const CATEGORIA_A_CLAVE = {
  'Panadería': 'panaderia',
  'Repostería': 'pasteleria',
  'Empanadas': 'empanada',
};

function claveParaCategoria(nombreCategoria) {
  return CATEGORIA_A_CLAVE[nombreCategoria] || 'general';
}

export function useHorarios() {
  const [horarios, setHorarios] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const cargar = () => {
      fetch('/api/horarios')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch horarios');
          return res.json();
        })
        .then((json) => {
          if (!cancelled) {
            setHorarios(json);
            setLoading(false);
          }
        })
        .catch(() => {
          // Si falla, no bloqueamos la UI: se asume disponible y el
          // backend seguirá validando igual al momento de enviar el pedido.
          if (!cancelled) setLoading(false);
        });
    };

    cargar();
    const interval = setInterval(cargar, 60_000); // refresca cada minuto

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Dado el nombre de categoría del catálogo, devuelve { disponible, desde, hasta } o null si aún no cargó
  const getEstadoCategoria = (nombreCategoria) => {
    if (!horarios) return null;
    if (horarios.abierta === false) {
      return { disponible: false, desde: null, hasta: null };
    }
    const clave = claveParaCategoria(nombreCategoria);
    return horarios.categorias?.[clave] || null;
  };

  return { horarios, loading, getEstadoCategoria };
}
