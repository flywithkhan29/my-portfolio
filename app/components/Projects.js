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

function ProjectCard({ project, delay }) {
  const [ref, visible] = useReveal();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fdf6f0',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: '20px',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible ? hovered ? 'translateY(-8px)' : 'translateY(0)' : 'translateY(30px)',
        boxShadow: hovered ? '0 20px 48px rgba(0,0,0,0.1)' : '0 4px 16px rgba(0,0,0,0.05)',
        transition: `all 0.5s ease ${delay}ms`,
      }}
    >
      <div style={{
        background: 'rgba(232,93,93,0.08)',
        border: '1px solid rgba(232,93,93,0.2)',
        margin: '20px 20px 0',
        borderRadius: '12px',
        height: '100px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '3rem',
      }}>
        {project.emoji || '📊'}
      </div>

      <div style={{ padding: '24px' }}>
        <p style={{ fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#e85d5d', marginBottom: '8px', fontWeight: '600' }}>
          Project {project.num}
        </p>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px', lineHeight: 1.3 }}>
          {project.title}
        </h3>
        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px' }}>
          {project.desc}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
          {project.tags.map((tag) => (
            <span key={tag} style={{
              fontSize: '0.75rem', color: '#555',
              background: '#fff', border: '1px solid rgba(0,0,0,0.1)',
              padding: '4px 12px', borderRadius: '999px',
            }}>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" style={{
              fontSize: '0.85rem', fontWeight: '600', color: '#e85d5d',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}
              onMouseEnter={e => e.currentTarget.style.gap = '10px'}
              onMouseLeave={e => e.currentTarget.style.gap = '6px'}
            >
              GitHub →
            </a>
          )}
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" style={{
              fontSize: '0.85rem', fontWeight: '600', color: '#5d83e8',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>
              Live Demo →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [ref, visible] = useReveal();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        const raw = await res.text();
        const data = raw ? JSON.parse(raw) : [];
        if (active) setProjects(res.ok && Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load projects:', error);
        if (active) setProjects([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProjects();
    return () => { active = false; };
  }, []);

  return (
    <section id="projects" style={{ padding: '100px 60px', background: '#fff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={ref} style={{
          textAlign: 'center', marginBottom: '60px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s ease',
        }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#e85d5d', marginBottom: '12px' }}>
            My Work
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-1px', marginBottom: '16px' }}>
            Featured Projects
          </h2>
          <div style={{ width: '48px', height: '3px', background: '#e85d5d', borderRadius: '2px', margin: '0 auto' }} />
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#999' }}>Loading projects...</p>}
        {!loading && projects.length === 0 && (
          <p style={{ textAlign: 'center', color: '#999' }}>No projects yet. Add some from the admin panel!</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
          {projects.map((project, i) => (
            <ProjectCard key={project._id} project={project} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
