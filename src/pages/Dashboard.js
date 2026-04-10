import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'https://fid-lepro-production.up.railway.app';
const VIOLET = '#6637ee';
const NAV_ITEMS = [
  { key: 'dashboard', label: '📊 Dashboard' },
  { key: 'clients', label: '👥 Clients' },
  { key: 'cartes', label: '🎴 Cartes' },
  { key: 'recompenses', label: '🏆 Récompenses' },
  { key: 'campagne', label: '📣 Campagne' },
  { key: 'avis', label: '⭐ Avis' },
  { key: 'profil', label: '⚙️ Profil' },
];

function StatCard({ value, label, color, icon }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderLeft: `5px solid ${color}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{value ?? '—'}</div>
        <div style={{ color: '#999', marginTop: '4px', fontSize: '14px' }}>{label}</div>
      </div>
    </div>
  );
}

function BarChart({ data }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.scans), 1);
  const step = Math.ceil(data.length / 10);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '120px', padding: '0 4px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }} title={`${d.date} : ${d.scans} scan(s)`}>
            <div style={{ width: '100%', background: d.scans > 0 ? VIOLET : '#e8e8e8', borderRadius: '3px 3px 0 0', height: `${Math.max((d.scans / maxVal) * 100, d.scans > 0 ? 8 : 2)}%`, transition: 'height 0.3s' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#aaa' }}>
        {data.filter((_, i) => i % step === 0 || i === data.length - 1).map(d => (
          <span key={d.date}>{d.date.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}

function PageDashboard({ token }) {
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API}/api/commercant/stats`, { headers }),
      axios.get(`${API}/api/commercant/clients`, { headers }),
    ]).then(([sRes, cRes]) => {
      setStats(sRes.data);
      setClients(cRes.data.clients);
    }).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p style={{ color: '#999', padding: '40px', textAlign: 'center' }}>Chargement...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#1a1a2e' }}>Tableau de bord</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard value={stats?.recap?.scansMois} label="Scans ce mois" color={VIOLET} icon="📲" />
        <StatCard value={stats?.recap?.clientsUniques30j} label="Clients actifs (30j)" color="#2ecc71" icon="👥" />
        <StatCard value={stats?.recap?.recompensesMois} label="Récompenses ce mois" color="#f39c12" icon="🏆" />
        <StatCard value={stats?.recap?.totalScans} label="Scans au total" color="#4facfe" icon="📊" />
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>Activité — 30 derniers jours</h3>
        <BarChart data={stats?.courbe30j} />
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>Top clients</h3>
        {clients.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Aucun client pour l'instant</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f2f5' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontWeight: '600' }}>Client</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontWeight: '600' }}>Email</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#666', fontWeight: '600' }}>Tampons</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontWeight: '600' }}>Dernière visite</th>
              </tr>
            </thead>
            <tbody>
              {clients.slice(0, 10).map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0f2f5' }}>
                  <td style={{ padding: '14px 12px', fontWeight: '600' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${VIOLET}, #9b59b6)`, color: 'white', fontWeight: 'bold', fontSize: '13px', marginRight: '10px' }}>{c.nom.charAt(0)}</span>
                    {c.nom}
                  </td>
                  <td style={{ padding: '14px 12px', color: '#666' }}>{c.email}</td>
                  <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                    <span style={{ background: `linear-gradient(135deg, ${VIOLET}, #9b59b6)`, color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{c.totalTampons}</span>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#666' }}>{new Date(c.derniereScan).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PageClients({ token }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/commercant/clients`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setClients(r.data.clients))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const exporter = () => {
    window.open(`${API}/api/commercant/export-clients?token=${token}`, '_blank');
  };

  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ color: '#999', padding: '40px', textAlign: 'center' }}>Chargement...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1a1a2e', margin: 0 }}>Mes clients ({clients.length})</h2>
        <button onClick={exporter} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
          ⬇️ Exporter CSV
        </button>
      </div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Rechercher un client..."
        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '2px solid #eee', fontSize: '15px', marginBottom: '16px', boxSizing: 'border-box' }}
      />
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Aucun client trouvé</p>
        ) : filtered.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #f0f2f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg, ${VIOLET}, #9b59b6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>{c.nom.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: '600', color: '#1a1a2e' }}>{c.nom}</div>
                <div style={{ fontSize: '13px', color: '#999' }}>{c.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: VIOLET, fontSize: '18px' }}>{c.totalTampons}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>tampons</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '14px' }}>{new Date(c.derniereScan).toLocaleDateString('fr-FR')}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>dernière visite</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageCartes({ token }) {
  const [cartes, setCartes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nom: '', type: 'tampons', maxTampons: 10, recompense: 0 });
  const [msg, setMsg] = useState('');

  const charger = useCallback(() => {
    axios.get(`${API}/api/commercant/cartes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setCartes(r.data.cartes))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { charger(); }, [charger]);

  const creer = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.post(`${API}/api/commercant/carte`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMsg('✅ Carte créée avec succès !');
      setForm({ nom: '', type: 'tampons', maxTampons: 10, recompense: 0 });
      charger();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Erreur'));
    }
  };

  if (loading) return <p style={{ color: '#999', padding: '40px', textAlign: 'center' }}>Chargement...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#1a1a2e' }}>Mes cartes de fidélité</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {cartes.length === 0 ? (
          <p style={{ color: '#999' }}>Aucune carte créée pour l'instant.</p>
        ) : cartes.map(c => (
          <div key={c.id} style={{ background: `linear-gradient(135deg, ${VIOLET}, #9b59b6)`, borderRadius: '16px', padding: '24px', color: 'white', boxShadow: '0 8px 24px rgba(102,55,238,0.3)' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{c.nom}</div>
            <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '16px' }}>Type : {c.type}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>{c.maxTampons}</div><div style={{ fontSize: '11px', opacity: 0.7 }}>tampons max</div></div>
              <div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>{c._count?.tampons ?? 0}</div><div style={{ fontSize: '11px', opacity: 0.7 }}>scans totaux</div></div>
              <div><div style={{ fontSize: '22px', fontWeight: 'bold' }}>{c.recompense}€</div><div style={{ fontSize: '11px', opacity: 0.7 }}>récompense</div></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>Créer une nouvelle carte</h3>
        {msg && <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', background: msg.startsWith('✅') ? '#e8f8f5' : '#fce8e8', color: msg.startsWith('✅') ? '#27ae60' : '#c00', fontSize: '14px' }}>{msg}</div>}
        <form onSubmit={creer} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Nom de la carte</label>
            <input required value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Ex: Carte café" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
              <option value="tampons">Tampons</option>
              <option value="points">Points</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Tampons max</label>
            <input required type="number" min="1" value={form.maxTampons} onChange={e => setForm(f => ({ ...f, maxTampons: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Récompense (€)</label>
            <input required type="number" min="0" step="0.01" value={form.recompense} onChange={e => setForm(f => ({ ...f, recompense: e.target.value }))} style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" style={{ background: `linear-gradient(135deg, ${VIOLET}, #9b59b6)`, color: 'white', border: 'none', padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              Créer la carte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PageRecompenses({ token }) {
  const [enAttente, setEnAttente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(null);
  const [msg, setMsg] = useState('');

  const charger = useCallback(() => {
    axios.get(`${API}/api/commercant/clients-recompenses`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setEnAttente(r.data.enAttente))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { charger(); }, [charger]);

  const valider = async (item) => {
    setValidating(item.clientId + item.carteId);
    setMsg('');
    try {
      await axios.post(`${API}/api/commercant/valider-recompense`, { clientId: item.clientId, carteId: item.carteId }, { headers: { Authorization: `Bearer ${token}` } });
      setMsg(`✅ Récompense validée pour ${item.nom} !`);
      charger();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Erreur'));
    } finally {
      setValidating(null);
    }
  };

  if (loading) return <p style={{ color: '#999', padding: '40px', textAlign: 'center' }}>Chargement...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#1a1a2e' }}>Récompenses à valider</h2>
      {msg && <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', background: msg.startsWith('✅') ? '#e8f8f5' : '#fce8e8', color: msg.startsWith('✅') ? '#27ae60' : '#c00', fontSize: '14px' }}>{msg}</div>}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {enAttente.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '60px' }}>🎉 Aucune récompense en attente de validation</p>
        ) : enAttente.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f0f2f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #f39c12, #e67e22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>🏆</div>
              <div>
                <div style={{ fontWeight: '700', color: '#1a1a2e' }}>{item.nom}</div>
                <div style={{ fontSize: '13px', color: '#999' }}>{item.email}</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>Carte : {item.carteName} — Récompense : {item.recompense}€</div>
              </div>
            </div>
            <button
              onClick={() => valider(item)}
              disabled={validating === item.clientId + item.carteId}
              style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: validating === item.clientId + item.carteId ? 0.6 : 1 }}
            >
              {validating === item.clientId + item.carteId ? 'Validation...' : 'Valider ✓'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const TEMPLATES = [
  { titre: 'Offre spéciale', message: 'Une offre exclusive vous attend ! Venez nous rendre visite dès maintenant.' },
  { titre: 'Nouveau produit', message: 'Découvrez notre nouvelle gamme de produits. En avant-première pour nos clients fidèles !' },
  { titre: 'Rappel fidélité', message: 'Vous êtes proche d\'une récompense ! Plus que quelques visites pour en profiter.' },
];

function PageCampagne({ token }) {
  const [titre, setTitre] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const appliquerTemplate = (t) => {
    setTitre(t.titre);
    setMessage(t.message);
    setMsg('');
  };

  const envoyer = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Envoyer "${titre}" à tous vos clients ?`)) return;
    setLoading(true);
    setMsg('');
    try {
      const res = await axios.post(`${API}/api/commercant/campagne`, { titre, message }, { headers: { Authorization: `Bearer ${token}` } });
      setMsg(`✅ ${res.data.message}`);
      setTitre('');
      setMessage('');
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Erreur lors de l\'envoi'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#1a1a2e' }}>Campagne de notifications</h2>
      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '16px' }}>Modèles rapides</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {TEMPLATES.map((t, i) => (
            <button key={i} onClick={() => appliquerTemplate(t)} style={{ background: '#f0f2f5', border: '2px solid transparent', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#333', transition: 'all 0.2s' }}
              onMouseEnter={e => e.target.style.borderColor = VIOLET}
              onMouseLeave={e => e.target.style.borderColor = 'transparent'}
            >
              {t.titre}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        {msg && <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', background: msg.startsWith('✅') ? '#e8f8f5' : '#fce8e8', color: msg.startsWith('✅') ? '#27ae60' : '#c00', fontSize: '14px' }}>{msg}</div>}
        <form onSubmit={envoyer}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Titre <span style={{ color: '#aaa', fontWeight: 'normal' }}>({titre.length}/50)</span></label>
            <input required maxLength={50} value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex: Promo du jour !" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Message <span style={{ color: '#aaa', fontWeight: 'normal' }}>({message.length}/160)</span></label>
            <textarea required maxLength={160} value={message} onChange={e => setMessage(e.target.value)} placeholder="Votre message personnalisé..." rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button type="submit" disabled={loading} style={{ background: `linear-gradient(135deg, ${VIOLET}, #9b59b6)`, color: 'white', border: 'none', padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Envoi...' : '📣 Envoyer à tous mes clients'}
            </button>
            <span style={{ color: '#aaa', fontSize: '13px' }}>Notifie tous les clients avec l'app installée</span>
          </div>
        </form>
      </div>
    </div>
  );
}

function EtoileNote({ note }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= note ? '#f39c12' : '#ddd', fontSize: '16px' }}>★</span>
      ))}
    </span>
  );
}

function PageAvis({ token }) {
  const [avis, setAvis] = useState([]);
  const [moyenne, setMoyenne] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [reponses, setReponses] = useState({});
  const [repondant, setRepondant] = useState(null);

  useEffect(() => {
    const commercantId = localStorage.getItem('commercantId');
    if (!commercantId) {
      setErreur('Identifiant commerçant introuvable. Reconnectez-vous.');
      setLoading(false);
      return;
    }
    axios.get(`${API}/api/client/avis/${commercantId}`)
      .then(r => {
        setAvis(r.data.avis);
        setMoyenne(r.data.moyenneNote);
        const init = {};
        r.data.avis.forEach(a => { init[a.id] = a.reponse ?? ''; });
        setReponses(init);
      })
      .catch(() => setErreur('Impossible de charger les avis.'))
      .finally(() => setLoading(false));
  }, []);

  const publierReponse = async (avisId) => {
    if (!reponses[avisId]?.trim()) return;
    setRepondant(avisId);
    try {
      await axios.post(`${API}/api/commercant/avis/${avisId}/reponse`, { reponse: reponses[avisId] }, { headers: { Authorization: `Bearer ${token}` } });
      setAvis(prev => prev.map(a => a.id === avisId ? { ...a, reponse: reponses[avisId] } : a));
    } catch {}
    setRepondant(null);
  };

  if (loading) return <p style={{ color: '#999', padding: '40px', textAlign: 'center' }}>Chargement...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#1a1a2e' }}>Avis clients</h2>
      {erreur && <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', background: '#fce8e8', color: '#c00', fontSize: '14px' }}>{erreur}</div>}
      {moyenne !== null && avis.length > 0 && (
        <div style={{ background: `linear-gradient(135deg, ${VIOLET}, #9b59b6)`, borderRadius: '16px', padding: '24px', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{moyenne}</div>
            <EtoileNote note={Math.round(parseFloat(moyenne))} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>Note moyenne</div>
            <div style={{ opacity: 0.8, fontSize: '14px', marginTop: '4px' }}>{avis.length} avis au total</div>
          </div>
        </div>
      )}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {avis.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '60px' }}>Aucun avis pour l'instant</p>
        ) : avis.map((a, i) => (
          <div key={i} style={{ padding: '20px 24px', borderBottom: '1px solid #f0f2f5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span style={{ fontWeight: '700', color: '#1a1a2e', marginRight: '12px' }}>{a.client?.nom ?? 'Client'}</span>
                <EtoileNote note={a.note} />
              </div>
              <span style={{ color: '#aaa', fontSize: '13px' }}>{new Date(a.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            {a.commentaire && <p style={{ color: '#555', margin: '0 0 12px', fontSize: '14px', lineHeight: '1.6' }}>{a.commentaire}</p>}
            {/* Réponse existante */}
            {a.reponse && (
              <div style={{ background: '#f5f0ff', borderLeft: `3px solid ${VIOLET}`, borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', color: VIOLET, fontWeight: '600', marginBottom: '4px' }}>Votre réponse</div>
                <div style={{ fontSize: '14px', color: '#333' }}>{a.reponse}</div>
              </div>
            )}
            {/* Zone de réponse */}
            {!a.reponse && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input
                  value={reponses[a.id] ?? ''}
                  onChange={e => setReponses(prev => ({ ...prev, [a.id]: e.target.value }))}
                  placeholder="Répondre à cet avis..."
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #eee', fontSize: '14px' }}
                />
                <button
                  onClick={() => publierReponse(a.id)}
                  disabled={repondant === a.id || !reponses[a.id]?.trim()}
                  style={{ background: VIOLET, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', opacity: (!reponses[a.id]?.trim() || repondant === a.id) ? 0.5 : 1 }}
                >
                  {repondant === a.id ? '...' : 'Répondre'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PageProfil({ token }) {
  const [form, setForm] = useState({ nom: '', telephone: '', adresse: '', description: '', horaires: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [mdp, setMdp] = useState({ ancien: '', nouveau: '', confirm: '' });
  const [savingMdp, setSavingMdp] = useState(false);
  const [msgMdp, setMsgMdp] = useState('');

  useEffect(() => {
    axios.get(`${API}/api/commercant/profil`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        const c = r.data.commercant;
        setForm({ nom: c.nom ?? '', telephone: c.telephone ?? '', adresse: c.adresse ?? '', description: c.description ?? '', horaires: c.horaires ?? '' });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const sauvegarder = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      await axios.patch(`${API}/api/commercant/profil`, form, { headers: { Authorization: `Bearer ${token}` } });
      setMsg('✅ Profil mis à jour !');
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Erreur'));
    }
    setSaving(false);
  };

  const changerMdp = async (e) => {
    e.preventDefault();
    if (mdp.nouveau !== mdp.confirm) { setMsgMdp('❌ Les mots de passe ne correspondent pas'); return; }
    if (mdp.nouveau.length < 8) { setMsgMdp('❌ Minimum 8 caractères'); return; }
    setSavingMdp(true); setMsgMdp('');
    try {
      await axios.post(`${API}/api/auth/changer-mdp`, { ancienMotDePasse: mdp.ancien, nouveauMotDePasse: mdp.nouveau }, { headers: { Authorization: `Bearer ${token}` } });
      setMsgMdp('✅ Mot de passe modifié !');
      setMdp({ ancien: '', nouveau: '', confirm: '' });
    } catch (err) {
      setMsgMdp('❌ ' + (err.response?.data?.message || 'Mot de passe actuel incorrect'));
    }
    setSavingMdp(false);
  };

  if (loading) return <p style={{ color: '#999', padding: '40px', textAlign: 'center' }}>Chargement...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#1a1a2e' }}>Mon profil</h2>

      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>Informations générales</h3>
        {msg && <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', background: msg.startsWith('✅') ? '#e8f8f5' : '#fce8e8', color: msg.startsWith('✅') ? '#27ae60' : '#c00', fontSize: '14px' }}>{msg}</div>}
        <form onSubmit={sauvegarder} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { key: 'nom', label: 'Nom du commerce', placeholder: 'Ex: Boulangerie Martin' },
            { key: 'telephone', label: 'Téléphone', placeholder: '06 00 00 00 00' },
            { key: 'adresse', label: 'Adresse', placeholder: '12 rue de la Paix, Paris' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>{f.label}</label>
              <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Décrivez votre commerce..." rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>Horaires <span style={{ color: '#aaa', fontWeight: 'normal' }}>(ex: Lun-Ven 9h-18h, Sam 10h-17h)</span></label>
            <input value={form.horaires} onChange={e => setForm(p => ({ ...p, horaires: e.target.value }))} placeholder="Lun-Ven 9h-19h, Sam 9h-13h, Dim fermé" style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={saving} style={{ background: `linear-gradient(135deg, ${VIOLET}, #9b59b6)`, color: 'white', border: 'none', padding: '14px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>Changer le mot de passe</h3>
        {msgMdp && <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', background: msgMdp.startsWith('✅') ? '#e8f8f5' : '#fce8e8', color: msgMdp.startsWith('✅') ? '#27ae60' : '#c00', fontSize: '14px' }}>{msgMdp}</div>}
        <form onSubmit={changerMdp} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          {[
            { key: 'ancien', label: 'Mot de passe actuel', type: 'password' },
            { key: 'nouveau', label: 'Nouveau mot de passe', type: 'password' },
            { key: 'confirm', label: 'Confirmer le nouveau', type: 'password' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>{f.label}</label>
              <input type={f.type} value={mdp[f.key]} onChange={e => setMdp(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
            </div>
          ))}
          <button type="submit" disabled={savingMdp} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: savingMdp ? 'not-allowed' : 'pointer', opacity: savingMdp ? 0.7 : 1, alignSelf: 'flex-start' }}>
            {savingMdp ? 'Modification...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '2px solid #eee',
  fontSize: '15px',
  boxSizing: 'border-box',
  outline: 'none',
};

function Dashboard() {
  const [page, setPage] = useState('dashboard');
  const token = localStorage.getItem('token');

  const deconnexion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('commercantId');
    window.location.href = '/login';
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <PageDashboard token={token} />;
      case 'clients': return <PageClients token={token} />;
      case 'cartes': return <PageCartes token={token} />;
      case 'recompenses': return <PageRecompenses token={token} />;
      case 'campagne': return <PageCampagne token={token} />;
      case 'avis': return <PageAvis token={token} />;
      case 'profil': return <PageProfil token={token} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'linear-gradient(180deg, #1a1a2e, #16213e)', padding: '28px 16px', display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '28px', paddingLeft: '10px' }}>
          🏪 FidèlePro
        </div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => setPage(item.key)}
            style={{
              background: page === item.key ? 'rgba(102,55,238,0.4)' : 'transparent',
              border: page === item.key ? '1px solid rgba(102,55,238,0.5)' : '1px solid transparent',
              color: page === item.key ? 'white' : '#888',
              padding: '11px 14px',
              borderRadius: '10px',
              textAlign: 'left',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: page === item.key ? '600' : '400',
              transition: 'all 0.15s',
            }}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={deconnexion}
          style={{ marginTop: 'auto', background: 'rgba(255,100,100,0.12)', border: '1px solid rgba(255,100,100,0.2)', color: '#ff6b6b', padding: '11px 14px', borderRadius: '10px', textAlign: 'left', fontSize: '14px', cursor: 'pointer' }}
        >
          🚪 Déconnexion
        </button>
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, padding: '40px', background: '#f0f2f5', overflowY: 'auto' }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default Dashboard;
