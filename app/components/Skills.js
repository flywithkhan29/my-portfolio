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

function SkillCard({ group, delay }) {
  const [ref, visible] = useReveal();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: '16px', padding: '32px',
        boxShadow: hovered ? '0 12px 40px rgba(232,93,93,0.12)' : '0 4px 16px rgba(0,0,0,0.05)',
        transform: visible ? hovered ? 'translateY(-6px)' : 'translateY(0)' : 'translateY(30px)',
        opacity: visible ? 1 : 0,
        transition: `all 0.5s ease ${delay}ms`,
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '16px' }}>{group.icon}</div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
        {group.title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {group.tags.map((tag) => (
          <span key={tag} style={{
            fontSize: '0.78rem', color: '#e85d5d',
            background: 'rgba(232,93,93,0.08)',
            border: '1px solid rgba(232,93,93,0.2)',
            padding: '4px 12px', borderRadius: '999px',
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const [ref, visible] = useReveal();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSkills() {
      try {
        const res = await fetch('/api/skills');
        const raw = await res.text();
        const data = raw ? JSON.parse(raw) : [];

        if (active) setSkills(res.ok && Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load skills:', error);
        if (active) setSkills([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSkills();
    return () => { active = false; };
  }, []);

  return (
    <section id="skills" style={{ padding: '100px 60px', background: '#fdf6f0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={ref} style={{
          textAlign: 'center', marginBottom: '60px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s ease',
        }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#e85d5d', marginBottom: '12px' }}>
            What I Work With
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-1px', marginBottom: '16px' }}>
            Skills & Tools
          </h2>
          <div style={{ width: '48px', height: '3px', background: '#e85d5d', borderRadius: '2px', margin: '0 auto' }} />
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#999' }}>Loading skills...</p>}
        {!loading && skills.length === 0 && (
          <p style={{ textAlign: 'center', color: '#999' }}>No skills yet. Add some from the admin panel!</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {skills.map((group, i) => (
            <SkillCard key={group._id} group={group} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
