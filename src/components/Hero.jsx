export default function Hero({ data, abierta }) {
  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const styles = {
    hero: {
      padding: '80px 24px 48px',
      textAlign: 'center',
      background: 'linear-gradient(180deg, rgba(64,206,224,0.05) 0%, transparent 100%)',
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: '50%',
      objectFit: 'cover',
      margin: '0 auto 24px',
      display: 'block',
      border: '2px solid rgba(64,206,224,0.3)',
      boxShadow: '0 0 30px rgba(64,206,224,0.1)',
    },
    emoji: {
      fontSize: 64,
      margin: '0 auto 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 100,
      height: 100,
      borderRadius: '50%',
      background: '#162023',
      border: '2px solid rgba(64,206,224,0.3)',
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 52,
      fontWeight: 700,
      color: '#e0eff1',
      margin: '0 0 8px',
      lineHeight: 1.1,
    },
    subtitle: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 18,
      color: '#40cee0',
      fontWeight: 500,
      margin: '0 0 8px',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    description: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 16,
      color: '#6a8f96',
      margin: '0 0 24px',
      lineHeight: 1.6,
      maxWidth: 500,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    date: {
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
      color: '#6a8f96',
      textTransform: 'capitalize',
    },
    divider: {
      width: 40,
      height: 2,
      background: '#40cee0',
      margin: '0 auto 16px',
      opacity: 0.5,
    },
    banner: {
      margin: '16px auto 0',
      maxWidth: 420,
      padding: '14px 20px',
      background: 'rgba(220,50,50,.15)',
      border: '1px solid rgba(220,50,50,.4)',
      borderRadius: 12,
      color: '#ff8080',
      fontSize: '.9rem',
      fontWeight: 500,
      textAlign: 'center',
    },
  };

  return (
    <section style={styles.hero}>
      {data?.logoBase64 ? (
        <img src={data.logoBase64} alt={data.nombre} style={styles.logo} />
      ) : (
        <div style={styles.emoji}>&#x1F95F;</div>
      )}
      <div style={styles.subtitle}>Especialidades Caseras</div>
      <h1 style={styles.title}>{data?.nombre || 'Delicias de Pam'}</h1>
      <div style={styles.divider} />
      <p style={styles.description}>
        {data?.descripcion || 'Especialidades caseras hechas con amor'}
      </p>
      <p style={styles.date}>{today}</p>
      {abierta === false && (
        <div style={styles.banner}>&#x26D4; Local cerrado — vuelve pronto</div>
      )}
    </section>
  );
}
