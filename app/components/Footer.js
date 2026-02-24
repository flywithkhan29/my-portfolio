export default function Footer() {
  return (
    <footer style={{
      background: '#fff',
      borderTop: '1px solid rgba(0,0,0,0.07)',
      padding: '32px 60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <p style={{ fontWeight: '700', fontSize: '1rem', color: '#1a1a1a' }}>Saad Khan</p>
      <p style={{ color: '#999', fontSize: '0.85rem' }}>© 2026 · Build With Next.js Or Once UI</p>
      <p style={{ color: '#e85d5d', fontSize: '0.85rem', fontWeight: '500' }}>Open to Opportunities</p>
    </footer>
  );
}