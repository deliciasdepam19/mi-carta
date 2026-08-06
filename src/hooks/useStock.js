import { useState, useEffect } from 'react';
import { SUPABASE_URL, SUPABASE_KEY } from '../config.js';

export function useStock(catalogo) {
  const [stock, setStock] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!catalogo) return;

    const now = new Date();
    const hour = now.getHours();

    const panaderiaItems = catalogo.items.filter((i) => i.categoria === 'Panadería');
    const reposteriaItems = catalogo.items.filter((i) => i.categoria === 'Repostería');

    const isPanaderiaOpen = hour >= 12 && hour < 18;
    const isEmpanadasOpen = hour >= 18 && hour < 22;
    const isReposteriaOpen = hour >= 12 && hour < 22;

    setIsOpen(isPanaderiaOpen || isEmpanadasOpen || isReposteriaOpen);

    fetch(`${SUPABASE_URL}/rest/v1/empanadas?select=tipo,stock`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((rows) => {
        const map = {};
        if (Array.isArray(rows)) {
          rows.forEach((r) => {
            map[r.tipo] = r.stock;
          });
        }
        panaderiaItems.forEach((item) => { map[item.nombre] = null; });
        reposteriaItems.forEach((item) => { map[item.nombre] = null; });
        setStock(map);
      })
      .catch(() => {
        const map = {};
        panaderiaItems.forEach((item) => { map[item.nombre] = null; });
        reposteriaItems.forEach((item) => { map[item.nombre] = null; });
        setStock(map);
      });
  }, [catalogo]);

  function getStockStatus(item) {
    const now = new Date();
    const hour = now.getHours();

    if (item.categoria === 'Panadería') {
      if (hour < 12) return { label: 'Desde 12:00H', available: false };
      if (hour >= 18) return { label: 'Cerrado', available: false };
      return { label: 'Disponible', available: true };
    }

    if (item.categoria === 'Empanadas') {
      if (hour < 18) return { label: 'Desde 18:00H', available: false };
      if (hour >= 22) return { label: 'Cerrado', available: false };
      const s = stock[item.nombre];
      if (s !== undefined && s !== null && s > 0) return { label: 'Disponible', available: true };
      if (s !== undefined && s !== null && s === 0) return { label: 'No disponible', available: false };
      if (s === undefined) return { label: 'Consultar stock', available: false };
      return { label: 'Disponible', available: true };
    }

    if (item.categoria === 'Repostería') {
      if (hour < 12) return { label: 'Desde 12:00H', available: false };
      if (hour >= 22) return { label: 'Cerrado', available: false };
      return { label: 'Disponible', available: true };
    }

    // Otros / Pastelería / cualquier categoría nueva
    return { label: 'Disponible', available: true };
  }

  return { stock, isOpen, getStockStatus };
}
