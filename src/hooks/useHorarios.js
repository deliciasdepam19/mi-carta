import { useState, useEffect } from 'react';
import { URL_SERVIDOR } from '../config.js';

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
      fetch(`${URL_SERVIDOR}/api/horarios`)
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
          // Si falla, asumimos CERRADO — el backend rechazará de todas formas
          // y evitamos mostrar el botón "+" cuando no sabemos el estado.
          if (!cancelled) {
            setHorarios({ abierta: false });
            setLoading(false);
          }
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
    if (!horarios) return { disponible: false, desde: null, hasta: null };
    if (horarios.abierta === false) {
      return { disponible: false, desde: null, hasta: null };
    }
    const clave = claveParaCategoria(nombreCategoria);
    return horarios.categorias?.[clave] || null;
  };

  return { horarios, loading, getEstadoCategoria };
}
