'use client';

import { useEffect, useRef, useState } from 'react';

function useReveal() {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

export default function About() {
  const [ref, visible] = useReveal();

  const facts = [
    { icon: '🎓', title: 'Education', desc: 'BCA · Parul University · Pursuing (Online Mode)' },
    { icon: '📍', title: 'Location', desc: 'Vadodara, India' },
    { icon: '💼', title: 'Current Role', desc: 'Data Analyst · Freelance' },
    { icon: '🌐', title: 'Languages', desc: 'English · Hindi · Gujarati · Urdu' },
  ];

  return (
    <section id="about" style={{ padding: '100px 60px', background: '#fff' }}>
      <div ref={ref} style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease',
      }}>
        <div>
          <p style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#e85d5d', marginBottom: '12px' }}>
            About Me
          </p>
          <h2 style={{ fontFamily: 'Inter', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '800', color: '#1a1a1a', marginBottom: '20px', letterSpacing: '-1px', lineHeight: 1.2 }}>
            Analyst. Storyteller.<br />Problem Solver.
          </h2>
          <div style={{ width: '48px', height: '3px', background: '#e85d5d', borderRadius: '2px', marginBottom: '28px' }} />
          <p style={{ color: '#555', lineHeight: '1.9', marginBottom: '16px', fontSize: '1rem' }}>
            I am a <strong style={{ color: '#1a1a1a' }}>Data Analyst</strong> with a passion for uncovering
            the stories hidden inside numbers. Great analysis isn't just about finding patterns —
            it's about communicating them clearly to people who make decisions.
          </p>
          <p style={{ color: '#555', lineHeight: '1.9', fontSize: '1rem' }}>
            My background spans <strong style={{ color: '#1a1a1a' }}>Data cleaning, Statistical analysis,
            Dashboard design</strong>, and <strong style={{ color: '#1a1a1a' }}>Business intelligence</strong>.
          </p>
        </div>

        <div style={{
          background: '#fdf6f0',
          border: '1px solid rgba(0,0,0,0.07)',
          borderRadius: '16px', padding: '40px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
        }}>
          <h3 style={{ fontFamily: 'Inter', fontSize: '1.2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '28px' }}>
            Quick Facts
          </h3>
          {facts.map((fact) => (
            <div key={fact.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '22px' }}>
              <div style={{
                width: '38px', height: '38px', flexShrink: 0,
                background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                {fact.icon}
              </div>
              <div>
                <h4 style={{ color: '#1a1a1a', fontSize: '0.95rem', fontWeight: '600', marginBottom: '2px' }}>{fact.title}</h4>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>{fact.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}