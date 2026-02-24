'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const [latestProject, setLatestProject] = useState('Add Your Project');

useEffect(() => {
  setTimeout(() => setVisible(true), 100);
  // Fetch latest project
  fetch('/api/projects')
    .then(r => r.json())
    .then(data => {
      if (data && data.length > 0) {
        setLatestProject(data[0].title);
      }
    });
}, []);

  return (
    <section id="home" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
      background: '#fdf6f0',
      textAlign: 'center',
    }}>

      {/* Pink radial glow */}
      <div style={{
        position: 'absolute',
        top: '10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '700px', height: '500px',
        background: 'radial-gradient(ellipse at center, rgba(255,180,180,0.35) 0%, rgba(255,200,200,0.15) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '780px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.9s ease',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '999px',
          padding: '6px 16px',
          fontSize: '0.85rem',
          color: '#555',
          marginBottom: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <span style={{ color: '#e85d5d', fontWeight: '600' }}>●</span>
          Recent project: <strong style={{ color: '#1a1a1a' }}>{latestProject}</strong>
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: '900',
          lineHeight: '1.05',
          color: '#1a1a1a',
          marginBottom: '24px',
          letterSpacing: '-2px',
        }}>
          Turning data into<br />
          <span style={{ color: '#1a1a1a' }}>decisions that matter.</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.15rem',
          color: '#666',
          lineHeight: '1.7',
          maxWidth: '520px',
          margin: '0 auto 44px',
          fontWeight: '300',
        }}>
          Data analyst passionate about transforming raw data into actionable insights. I enjoy discovering trends, solving problems, and creating data stories that support smarter business decisions.
        </p>
        {/* Social Icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '48px' }}>
          {[
            { label: 'GitHub', href: 'https://github.com/flywithkhan29', icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.9.57.1.78-.25.78-.55v-1.93c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.9-.39 2.88-.39s1.96.13 2.88.39c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.77 1.08.77 2.18v3.23c0 .31.21.66.79.55A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/>
        </svg>
      )
    },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/in/flywithkhan/', icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.49 6S0 4.88 0 3.5 1.12 1 2.49 1s2.49 1.12 2.49 2.5zM.24 8.25h4.5V24H.24zM8.25 8.25h4.31v2.16h.06c.6-1.14 2.06-2.34 4.25-2.34 4.55 0 5.39 2.99 5.39 6.88V24h-4.5v-7.96c0-1.9-.03-4.34-2.65-4.34-2.66 0-3.07 2.08-3.07 4.21V24h-4.5z"/>
        </svg>
      )
    },
            { label: 'Email', href: 'mailto:saadkhanpathan386@outlook.com', icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 13.5L0 6.75V18a2 2 0 002 2h20a2 2 0 002-2V6.75L12 13.5zm12-9H0l12 7.5L24 4.5z"/>
        </svg>
      )
    },
          ].map((s) => (
            <a key={s.label} href={s.href} title={s.label} 
               target="_blank"
               rel="noopener noreferrer"
               style={{
              width: '44px', height: '44px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap',
          padding: '32px 48px',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '20px',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(8px)',
        }}>
          {[
            { num: '2+', label: 'Years Experience' },
            { num: '12+', label: 'Projects Done' },
            { num: '5+', label: 'Tools Mastered' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-1px' }}>
                {stat.num}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}