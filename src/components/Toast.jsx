import { useEffect, useState } from 'react';

export default function Toast() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hide = setTimeout(() => setExiting(true), 6000);
    const remove = setTimeout(() => { setVisible(false); setExiting(false); }, 6300);
    return () => { clearTimeout(hide); clearTimeout(remove); };
  }, [visible]);

  if (!visible) return null;

  const styles = {
    toast: {
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: exiting ? 'translate(-50%, 20px)' : 'translate(-50%, 0)',
      zIndex: 400,
      background: '#162023',
      borderRadius: 12,
      border: '1px solid rgba(64,206,224,0.2)',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
      opacity: exiting ? 0 : 1,
      transition: 'opacity 0.3s, transform 0.3s',
      maxWidth: 'calc(100% - 48px)',
    },
    icon: {
      fontSize: 20,
    },
    text: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
      color: '#e0eff1',
      lineHeight: 1.4,
    },
    link: {
      color: '#40cee0',
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.toast}>
      <span style={styles.icon}>&#x1F370;</span>
      <span style={styles.text}>
        Algunos productos de repostería requieren 3 días de anticipación
      </span>
    </div>
  );
}
