'use client';

import { useState } from 'react';

const links = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

export default function Navbar() {
  const [active, setActive] = useState('Home');

  const getHref = (link) => '#' + link.toLowerCase();

  return (
    <nav style={{
      position: 'fixed', top: 24, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      display: 'flex', alignItems: 'center', gap: '4px',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(16px)',
      borderRadius: '999px',
      padding: '6px 8px',
      boxShadow: '0 2px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)',
    }}>
      {links.map((link) => (
        <a
          key={link}
          href={getHref(link)}
          onClick={() => setActive(link)}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '0.88rem',
            fontWeight: active === link ? '600' : '400',
            color: active === link ? '#1a1a1a' : '#666',
            background: active === link ? '#f0f0f0' : 'transparent',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (active !== link) e.target.style.color = '#1a1a1a'; }}
          onMouseLeave={e => { if (active !== link) e.target.style.color = '#666'; }}
        >
          {link}
        </a>
      ))}
    </nav>
  );
}