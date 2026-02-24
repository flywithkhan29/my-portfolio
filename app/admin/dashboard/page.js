'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contact, setContact] = useState({ email: '', linkedin: '', github: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Project form
  const [pForm, setPForm] = useState({ num: '', title: '', desc: '', tags: '', emoji: '📊', githubLink: '', liveLink: '' });
  const [editingP, setEditingP] = useState(null);

  // Skill form
  const [sForm, setSForm] = useState({ icon: '', title: '', tags: '' });
  const [editingS, setEditingS] = useState(null);

  async function fetchJsonSafe(url, fallback) {
    try {
      const res = await fetch(url);
      const raw = await res.text();
      if (!raw) return fallback;
      const data = JSON.parse(raw);
      return res.ok ? data : fallback;
    } catch {
      return fallback;
    }
  }

  async function fetchAll() {
    const [p, s, c] = await Promise.all([
      fetchJsonSafe('/api/projects', []),
      fetchJsonSafe('/api/skills', []),
      fetchJsonSafe('/api/contact', null),
    ]);
    setProjects(Array.isArray(p) ? p : []);
    setSkills(Array.isArray(s) ? s : []);
    if (c) setContact(c);
  }

  useEffect(() => {
    if (localStorage.getItem('admin_auth') !== 'true') router.push('/admin');
    fetchAll();
  }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  // ── PROJECTS ──
  const saveProject = async () => {
    setLoading(true);
    const body = { ...pForm, tags: pForm.tags.split(',').map(t => t.trim()) };
    if (editingP) {
      await fetch('/api/projects/' + editingP, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      showMsg('Project updated!');
    } else {
      await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      showMsg('Project added!');
    }
    setPForm({ num: '', title: '', desc: '', tags: '', emoji: '📊', githubLink: '', liveLink: '' });
    setEditingP(null);
    fetchAll();
    setLoading(false);
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    await fetch('/api/projects/' + id, { method: 'DELETE' });
    showMsg('Project deleted!');
    fetchAll();
  };

  const editProject = (p) => {
    setPForm({ ...p, tags: p.tags.join(', ') });
    setEditingP(p._id);
  };

  // ── SKILLS ──
  const saveSkill = async () => {
    setLoading(true);
    const body = { ...sForm, tags: sForm.tags.split(',').map(t => t.trim()) };
    if (editingS) {
      await fetch('/api/skills/' + editingS, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      showMsg('Skill updated!');
    } else {
      await fetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      showMsg('Skill added!');
    }
    setSForm({ icon: '', title: '', tags: '' });
    setEditingS(null);
    fetchAll();
    setLoading(false);
  };

  const deleteSkill = async (id) => {
    if (!confirm('Delete this skill?')) return;
    await fetch('/api/skills/' + id, { method: 'DELETE' });
    showMsg('Skill deleted!');
    fetchAll();
  };

  const editSkill = (s) => {
    setSForm({ ...s, tags: s.tags.join(', ') });
    setEditingS(s._id);
  };

  // ── CONTACT ──
  const saveContact = async () => {
    setLoading(true);
    await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contact) });
    showMsg('Contact info saved!');
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)',
    fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
    outline: 'none', marginBottom: '10px',
  };

  const btnStyle = {
    background: '#e85d5d', color: '#fff', border: 'none',
    padding: '10px 24px', borderRadius: '999px',
    fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6f0', fontFamily: 'Inter, sans-serif' }}>

      {/* Top Bar */}
      <div style={{
        background: '#fff', padding: '16px 40px',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a1a1a' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {msg && <span style={{ color: '#4caf82', fontSize: '0.85rem', fontWeight: '600' }}>{msg}</span>}
          <button onClick={() => { localStorage.removeItem('admin_auth'); router.push('/admin'); }} style={{ ...btnStyle, background: '#999' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '24px 40px 0' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['projects', 'skills', 'contact', 'messages'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 24px', borderRadius: '999px',
              border: 'none', cursor: 'pointer',
              background: tab === t ? '#e85d5d' : '#fff',
              color: tab === t ? '#fff' : '#666',
              fontWeight: '600', fontSize: '0.85rem',
              textTransform: 'capitalize',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '32px 40px' }}>

        {/* ── PROJECTS TAB ── */}
        {tab === 'projects' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

            {/* Form */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>
                {editingP ? 'Edit Project' : 'Add Project'}
              </h2>
              <input style={inputStyle} placeholder="Number (e.g. 01)" value={pForm.num} onChange={e => setPForm({ ...pForm, num: e.target.value })} />
              <input style={inputStyle} placeholder="Project Title" value={pForm.title} onChange={e => setPForm({ ...pForm, title: e.target.value })} />
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }} placeholder="Description" value={pForm.desc} onChange={e => setPForm({ ...pForm, desc: e.target.value })} />
              <input style={inputStyle} placeholder="Tags (comma separated: SQL, Python, Power BI)" value={pForm.tags} onChange={e => setPForm({ ...pForm, tags: e.target.value })} />
              <input style={inputStyle} placeholder="Emoji (e.g. 📊)" value={pForm.emoji} onChange={e => setPForm({ ...pForm, emoji: e.target.value })} />
              <input style={inputStyle} placeholder="GitHub Link" value={pForm.githubLink} onChange={e => setPForm({ ...pForm, githubLink: e.target.value })} />
              <input style={inputStyle} placeholder="Live Link (optional)" value={pForm.liveLink} onChange={e => setPForm({ ...pForm, liveLink: e.target.value })} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={saveProject} style={btnStyle}>{loading ? 'Saving...' : editingP ? 'Update' : 'Add Project'}</button>
                {editingP && <button onClick={() => { setEditingP(null); setPForm({ num: '', title: '', desc: '', tags: '', emoji: '📊', githubLink: '', liveLink: '' }); }} style={{ ...btnStyle, background: '#ccc' }}>Cancel</button>}
              </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontWeight: '700', color: '#1a1a1a' }}>Your Projects ({projects.length})</h2>
              {projects.length === 0 && <p style={{ color: '#999' }}>No projects yet. Add one!</p>}
              {projects.map(p => (
                <div key={p._id} style={{
                  background: '#fff', borderRadius: '12px', padding: '20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.07)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '1rem', fontWeight: '700', color: '#1a1a1a' }}>{p.emoji} {p.title}</p>
                      <p style={{ fontSize: '0.82rem', color: '#999', marginTop: '4px' }}>{p.tags.join(', ')}</p>
                      {p.githubLink && (
                        <a href={p.githubLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#e85d5d', marginTop: '6px', display: 'block' }}>
                          🔗 GitHub Link
                        </a>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => editProject(p)} style={{ ...btnStyle, background: '#5d83e8', padding: '6px 14px', fontSize: '0.78rem' }}>Edit</button>
                      <button onClick={() => deleteProject(p._id)} style={{ ...btnStyle, background: '#ff4444', padding: '6px 14px', fontSize: '0.78rem' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SKILLS TAB ── */}
        {tab === 'skills' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>
                {editingS ? 'Edit Skill' : 'Add Skill'}
              </h2>
              <input style={inputStyle} placeholder="Icon (e.g. 🗄️)" value={sForm.icon} onChange={e => setSForm({ ...sForm, icon: e.target.value })} />
              <input style={inputStyle} placeholder="Category Title (e.g. Data & Databases)" value={sForm.title} onChange={e => setSForm({ ...sForm, title: e.target.value })} />
              <input style={inputStyle} placeholder="Skills (comma separated: SQL, MySQL, Excel)" value={sForm.tags} onChange={e => setSForm({ ...sForm, tags: e.target.value })} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={saveSkill} style={btnStyle}>{loading ? 'Saving...' : editingS ? 'Update' : 'Add Skill'}</button>
                {editingS && <button onClick={() => { setEditingS(null); setSForm({ icon: '', title: '', tags: '' }); }} style={{ ...btnStyle, background: '#ccc' }}>Cancel</button>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontWeight: '700', color: '#1a1a1a' }}>Your Skills ({skills.length})</h2>
              {skills.length === 0 && <p style={{ color: '#999' }}>No skills yet. Add one!</p>}
              {skills.map(s => (
                <div key={s._id} style={{
                  background: '#fff', borderRadius: '12px', padding: '20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.07)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: '700', color: '#1a1a1a' }}>{s.icon} {s.title}</p>
                      <p style={{ fontSize: '0.82rem', color: '#999', marginTop: '4px' }}>{s.tags.join(', ')}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => editSkill(s)} style={{ ...btnStyle, background: '#5d83e8', padding: '6px 14px', fontSize: '0.78rem' }}>Edit</button>
                      <button onClick={() => deleteSkill(s._id)} style={{ ...btnStyle, background: '#ff4444', padding: '6px 14px', fontSize: '0.78rem' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CONTACT TAB ── */}
        {tab === 'contact' && (
          <div style={{ maxWidth: '500px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontWeight: '700', marginBottom: '20px', color: '#1a1a1a' }}>Contact Info</h2>
              <label style={{ fontSize: '0.78rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
              <input style={inputStyle} placeholder="your@email.com" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
              <label style={{ fontSize: '0.78rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>LinkedIn URL</label>
              <input style={inputStyle} placeholder="https://linkedin.com/in/yourprofile" value={contact.linkedin} onChange={e => setContact({ ...contact, linkedin: e.target.value })} />
              <label style={{ fontSize: '0.78rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>GitHub URL</label>
              <input style={inputStyle} placeholder="https://github.com/yourusername" value={contact.github} onChange={e => setContact({ ...contact, github: e.target.value })} />
              <button onClick={saveContact} style={{ ...btnStyle, marginTop: '8px' }}>{loading ? 'Saving...' : 'Save Contact Info'}</button>
            </div>
          </div>
        )}

      </div>
      {/* ── MESSAGES TAB ── */}
      {tab === 'messages' && (
       <MessagesTab />
)}
    </div>
  );
  function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/messages')
      .then(r => r.json())
      .then(data => { setMessages(data || []); setLoading(false); });
  }, []);

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    await fetch('/api/messages/' + id, { method: 'DELETE' });
    setMessages(messages.filter(m => m._id !== id));
  };

  if (loading) return <p style={{ color: '#999' }}>Loading messages...</p>;
  if (messages.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
      <p style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</p>
      <p>No messages yet. They'll appear here when someone contacts you.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' }}>
      <h2 style={{ fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
        Messages ({messages.length})
      </h2>
      {messages.map(m => (
        <div key={m._id} style={{
          background: '#fff', borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.07)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <p style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '1rem' }}>{m.name}</p>
              <p style={{ color: '#e85d5d', fontSize: '0.85rem' }}>{m.email}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <p style={{ color: '#999', fontSize: '0.78rem' }}>
                {new Date(m.createdAt).toLocaleDateString()}
              </p>
              <button onClick={() => deleteMessage(m._id)} style={{
                background: '#ff4444', color: '#fff', border: 'none',
                padding: '6px 14px', borderRadius: '999px',
                fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer',
              }}>
                Delete
              </button>
            </div>
          </div>
          {m.subject && <p style={{ color: '#555', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>Subject: {m.subject}</p>}
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.7' }}>{m.message}</p>
        </div>
      ))}
    </div>
  );
}
}
