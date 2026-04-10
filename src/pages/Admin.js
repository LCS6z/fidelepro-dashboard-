import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://fid-lepro-production.up.railway.app';

const VIOLET = '#6637ee';
const BLANC = '#ffffff';
const GRIS = '#f5f5f5';
const VERT = '#2ecc71';
const ROUGE = '#e74c3c';
const ORANGE = '#f39c12';

const CATEGORIES = ['Restauration', 'Beauté', 'Sport', 'Bien_être', 'Shopping', 'Santé', 'Loisirs', 'Services', 'Autres'];

const card = (extra = {}) => ({
  backgroundColor: BLANC, borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)', ...extra
});

const badge = (couleur) => ({
  backgroundColor: couleur + '22', color: couleur,
  padding: '4px 10px', borderRadius: '20px',
  fontSize: '12px', fontWeight: 'bold', display: 'inline-block'
});

const btn = (couleur, extra = {}) => ({
  backgroundColor: couleur, color: BLANC, border: 'none',
  borderRadius: '6px', padding: '6px 12px',
  cursor: 'pointer', fontSize: '13px', fontWeight: '600', ...extra
});

export default function Admin() {
  const [onglet, setOnglet] = useState('stats');
  const [stats, setStats] = useState(null);
  const [commercants, setCommercants] = useState([]);
  const [clients, setClients] = useState([]);
  const [scans, setScans] = useState([]);
  const [recompenses, setRecompenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPartenaire, setEditPartenaire] = useState(null); // { id, nom, estPartenaire, categorie, description, horaires }
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      const [statsRes, commercantsRes, clientsRes, scansRes, recompensesRes] = await Promise.all([
        axios.get(`${API}/api/admin/stats`, { headers }),
        axios.get(`${API}/api/admin/commercants`, { headers }),
        axios.get(`${API}/api/admin/clients`, { headers }),
        axios.get(`${API}/api/admin/scans`, { headers }),
        axios.get(`${API}/api/admin/recompenses`, { headers }),
      ]);
      setStats(statsRes.data);
      setCommercants(commercantsRes.data.commercants);
      setClients(clientsRes.data.clients);
      setScans(scansRes.data.scans);
      setRecompenses(recompensesRes.data.recompenses);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { chargerDonnees(); }, []); // eslint-disable-line

  const changerStatut = async (id, statut) => {
    try {
      await axios.patch(`${API}/api/admin/commercant/${id}/statut`, { statut }, { headers });
      chargerDonnees();
    } catch {
      alert('Erreur lors du changement de statut');
    }
  };

  const sauvegarderPartenaire = async () => {
    if (!editPartenaire) return;
    setSaving(true);
    try {
      await axios.patch(`${API}/api/admin/commercant/${editPartenaire.id}/partenaire`, {
        estPartenaire: editPartenaire.estPartenaire,
        categorie: editPartenaire.categorie || null,
        description: editPartenaire.description || null,
        horaires: editPartenaire.horaires || null,
      }, { headers });
      setEditPartenaire(null);
      chargerDonnees();
    } catch {
      alert('Erreur lors de la sauvegarde');
    }
    setSaving(false);
  };

  const couleurStatut = (statut) => {
    switch (statut) {
      case 'actif': return VERT;
      case 'inactif': return ORANGE;
      case 'suspendu': return ROUGE;
      case 'résilié': return '#999';
      default: return '#999';
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <p style={{ color: VIOLET, fontSize: '18px' }}>Chargement...</p>
    </div>
  );

  const ONGLETS = [
    { id: 'commercants', label: '🏪 Commerçants' },
    { id: 'partenaires', label: '⭐ Partenaires' },
    { id: 'clients', label: '👥 Clients' },
    { id: 'scans', label: '🎯 Scans' },
    { id: 'recompenses', label: '🎁 Récompenses' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: GRIS, fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Header */}
      <div style={{ backgroundColor: VIOLET, padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: BLANC, margin: 0, fontSize: '22px' }}>🛡️ Panel Admin — FidèlePro</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          style={btn('rgba(255,255,255,0.2)')}>
          Déconnexion
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'flex', gap: '16px', padding: '24px 32px', flexWrap: 'wrap' }}>
          {[
            { label: 'Clients', valeur: stats.totalClients, icon: '👥', couleur: VIOLET },
            { label: 'Commerçants', valeur: stats.totalCommercants, icon: '🏪', couleur: ORANGE },
            { label: 'Actifs', valeur: stats.commercantsActifs, icon: '✅', couleur: VERT },
            { label: 'Scans total', valeur: stats.totalScans, icon: '🎯', couleur: ROUGE },
            { label: 'Récompenses', valeur: recompenses.length, icon: '🎁', couleur: '#9b59b6' },
          ].map((s, i) => (
            <div key={i} style={{ ...card({ borderLeft: `4px solid ${s.couleur}`, padding: '20px 24px', flex: '1', minWidth: '140px' }) }}>
              <div style={{ fontSize: '26px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '30px', fontWeight: 'bold', color: s.couleur }}>{s.valeur}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Onglets */}
      <div style={{ display: 'flex', gap: '8px', padding: '0 32px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {ONGLETS.map(o => (
          <button key={o.id} onClick={() => setOnglet(o.id)}
            style={btn(onglet === o.id ? VIOLET : BLANC, { color: onglet === o.id ? BLANC : '#333', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '10px 18px' })}>
            {o.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 32px 32px' }}>

        {/* ── Commerçants ── */}
        {onglet === 'commercants' && (
          <div style={card({ overflow: 'hidden' })}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: GRIS }}>
                  {['Nom', 'Email', 'Téléphone', 'Statut', 'Setup', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commercants.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: '1px solid #f0f0f0', backgroundColor: i % 2 === 0 ? BLANC : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#333' }}>{c.nom}</td>
                    <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{c.email}</td>
                    <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{c.telephone || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={badge(couleurStatut(c.statutAbonnement))}>{c.statutAbonnement}</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {c.stripeSetupPaid ? '✅' : '❌'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select onChange={(e) => changerStatut(c.id, e.target.value)} defaultValue={c.statutAbonnement}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', cursor: 'pointer' }}>
                        <option value="actif">Activer</option>
                        <option value="inactif">Désactiver</option>
                        <option value="suspendu">Suspendre</option>
                        <option value="résilié">Résilier</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Partenaires ── */}
        {onglet === 'partenaires' && (
          <div>
            {editPartenaire && (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ ...card({ padding: '32px', width: '480px', maxWidth: '90vw' }) }}>
                  <h2 style={{ margin: '0 0 20px', color: '#333' }}>⭐ {editPartenaire.nom}</h2>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={editPartenaire.estPartenaire}
                      onChange={e => setEditPartenaire(p => ({ ...p, estPartenaire: e.target.checked }))}
                      style={{ width: '18px', height: '18px' }} />
                    <span style={{ fontWeight: '600', color: '#333' }}>Commerce partenaire</span>
                  </label>

                  {editPartenaire.estPartenaire && (
                    <>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Catégorie</label>
                        <select value={editPartenaire.categorie || ''} onChange={e => setEditPartenaire(p => ({ ...p, categorie: e.target.value }))}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}>
                          <option value="">— Choisir —</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Description</label>
                        <textarea value={editPartenaire.description || ''} onChange={e => setEditPartenaire(p => ({ ...p, description: e.target.value }))}
                          placeholder="Courte description du commerce..." rows={3}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' }}>Horaires</label>
                        <input value={editPartenaire.horaires || ''} onChange={e => setEditPartenaire(p => ({ ...p, horaires: e.target.value }))}
                          placeholder="Ex : Lun-Ven 9h-19h, Sam 9h-13h"
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
                      </div>
                    </>
                  )}

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setEditPartenaire(null)} style={btn('#aaa')}>Annuler</button>
                    <button onClick={sauvegarderPartenaire} disabled={saving} style={btn(VIOLET, { opacity: saving ? 0.6 : 1 })}>
                      {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={card({ overflow: 'hidden' })}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: GRIS }}>
                    {['Nom', 'Email', 'Partenaire', 'Catégorie', 'Horaires', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: '600' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {commercants.map((c, i) => (
                    <tr key={c.id} style={{ borderTop: '1px solid #f0f0f0', backgroundColor: i % 2 === 0 ? BLANC : '#fafafa' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#333' }}>{c.nom}</td>
                      <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{c.email}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {c.estPartenaire ? <span style={badge(VERT)}>⭐ Oui</span> : <span style={badge('#aaa')}>Non</span>}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{c.categorie || '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#666', fontSize: '12px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.horaires || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => setEditPartenaire({ id: c.id, nom: c.nom, estPartenaire: c.estPartenaire || false, categorie: c.categorie || '', description: c.description || '', horaires: c.horaires || '' })}
                          style={btn(VIOLET)}>
                          ✏️ Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Clients ── */}
        {onglet === 'clients' && (
          <div style={card({ overflow: 'hidden' })}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: GRIS }}>
                  {['Nom', 'Email', 'Tampons', 'Inscrit le'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: '1px solid #f0f0f0', backgroundColor: i % 2 === 0 ? BLANC : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#333' }}>{c.nom}</td>
                    <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{c.email}</td>
                    <td style={{ padding: '12px 16px', color: VIOLET, fontWeight: 'bold' }}>{c._count.tampons}</td>
                    <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Scans ── */}
        {onglet === 'scans' && (
          <div style={card({ overflow: 'hidden' })}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: GRIS }}>
                  {['Client', 'Commerce', 'Date'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scans.map((s, i) => (
                  <tr key={s.id} style={{ borderTop: '1px solid #f0f0f0', backgroundColor: i % 2 === 0 ? BLANC : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#333' }}>{s.client?.nom}</td>
                    <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{s.carte?.commercant?.nom}</td>
                    <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Récompenses ── */}
        {onglet === 'recompenses' && (
          <div style={card({ overflow: 'hidden' })}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🎁</span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{recompenses.length} récompenses validées</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: GRIS }}>
                  {['Client', 'Email', 'Commerce', 'Carte', 'Date validée'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recompenses.map((r, i) => (
                  <tr key={r.id} style={{ borderTop: '1px solid #f0f0f0', backgroundColor: i % 2 === 0 ? BLANC : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#333' }}>{r.client?.nom}</td>
                    <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{r.client?.email}</td>
                    <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{r.carte?.commercant?.nom}</td>
                    <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{r.carte?.nom}</td>
                    <td style={{ padding: '12px 16px', color: '#666', fontSize: '13px' }}>{new Date(r.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
                {recompenses.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#aaa' }}>Aucune récompense validée pour l'instant</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
