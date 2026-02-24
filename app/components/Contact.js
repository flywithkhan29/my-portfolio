'use client';

import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

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

export default function Contact() {
  const [ref, visible] = useReveal();
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Save to Firebase
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      // Send email via EmailJS
      await emailjs.send(
        'service_ij8j6fe',
        'template_69lohml',
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        'bjmcxTuraaHNIS8Jt'
      );

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const contacts = [
    { icon: '✉️', label: 'Email', value: 'your.email@example.com' },
    { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/yourprofile' },
    { icon: '🐙', label: 'GitHub', value: 'github.com/yourusername' },
  ];

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(0,0,0,0.1)',
    background: '#fff', fontSize: '0.95rem',
    color: '#1a1a1a', fontFamily: 'Inter, sans-serif',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <section id="contact" style={{ padding: '100px 60px', background: '#fdf6f0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#e85d5d', marginBottom: '12px' }}>
            Get In Touch
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-1px', marginBottom: '16px' }}>
            Let's Work Together
          </h2>
          <div style={{ width: '48px', height: '3px', background: '#e85d5d', borderRadius: '2px', margin: '0 auto' }} />
        </div>

        <div ref={ref} style={{
          display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px', alignItems: 'start',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s ease',
        }}>

          {/* Left */}
          <div>
            <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '40px' }}>
              Whether you have a project in mind, a data problem to solve,
              or just want to connect — my inbox is always open.
            </p>
            {contacts.map((c) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '44px', height: '44px', background: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flexShrink: 0,
                }}>
                  {c.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{c.label}</p>
                  <p style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: '500' }}>{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Form */}
          <form onSubmit={handleSubmit} style={{
            background: '#fff', borderRadius: '20px', padding: '40px',
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: '8px' }}>Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#e85d5d'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: '8px' }}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#e85d5d'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: '8px' }}>Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Project Inquiry" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#e85d5d'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#999', display: 'block', marginBottom: '8px' }}>Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project..." rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor = '#e85d5d'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'} />
            </div>

            <button type="submit" style={{
              background: status === 'success' ? '#4caf82' : status === 'error' ? '#ff4444' : '#e85d5d',
              color: '#fff', border: 'none', padding: '14px 32px',
              borderRadius: '999px', fontSize: '0.9rem', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.3s ease', alignSelf: 'flex-start',
            }}>
              {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent ✓' : status === 'error' ? 'Failed. Try Again' : 'Send Message →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
} 