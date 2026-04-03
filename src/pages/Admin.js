import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://fid-lepro-production.up.railway.app';

const VIOLET = '#6637ee';
const BLANC = '#ffffff';
const GRIS = '#f5f5f5';
const VERT = '#2ecc71';
const ROUGE = '#e74c3c';
const ORANGE = '#f39c12';

export default function Admin() {
  const [onglet, setOnglet] = useState('stats');
  const [stats, setStats] = useState(null);
  const [commercants, setCommercants] = useState([]);
  const [clients, setClients] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      const [statsRes, commercantsRes, clientsRes, scansRes] = await Promise.all([
        axios.get(`${API}/api/admin/stats`, { headers }),
        axios.get(`${API}/api/admin/commercants`, { headers }),
        axios.get(`${API}/api/admin/clients`, { headers }),
        axios.get(`${API}/api/admin/scans`, { headers }),
      ]);
      setStats(statsRes.data);
      setCommercants(commercantsRes.data.commercants);
      setClients(clientsRes.data.clients);
      setScans(scansRes.data.scans);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { chargerDonnees(); }, []);

  const changerStatut = async (id, statut) => {
    try {
      await axios.patch(`${API}/api/admin/commercant/${id}/statut`, { statut }, { headers });
      chargerDonnees();
    } catch (err) {
      alert('Erreur lors du changement de statut');
    }
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: GRIS, fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ backgroundColor: VIOLET, padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: BLANC, margin: 0, fontSize: '24px' }}>🛡️ Panel Admin — FidèlePro</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: BLANC, border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px' }}>
          Déconnexion
        </button>
      </div>

      {stats && (
        <div style={{ display: 'flex', gap: '16px', padding: '24px 32px', flexWrap: 'wrap' }}>
          {[
            { label: 'Clients', valeur: stats.totalClients, icon: '👥', couleur: VIOLET },
            { label: 'Commerçants', valeur: stats.totalCommercants, icon: '🏪', couleur: ORANGE },
            { label: 'Actifs', valeur: stats.commercantsActifs, icon: '✅', couleur: VERT },
            { label: 'Scans total', valeur: stats.totalScans, icon: '🎯', couleur: ROUGE },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: BLANC, borderRadius: '12px', padding: '20px 24px', flex: '1', minWidth: '150px', borderLeft: `4px solid ${s.couleur}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: s.couleur }}>{s.valeur}</div>
              <div style={{ fontSize: '14px', color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', padding: '0 32px', marginBottom: '24px' }}>
        {[
          { id: 'commercants', label: '🏪 Commerçants' },
          { id: 'clients', label: '👥 Clients' },
          { id: 'scans', label: '🎯 Scans' },
        ].map(o => (
          <button key={o.id} onClick={() => setOnglet(o.id)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', backgroundColor: onglet === o.id ? VIOLET : BLANC, color: onglet === o.id ? BLANC : '#333', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {o.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 32px 32px' }}>
        {onglet === 'commercants' && (
          <div style={{ backgroundColor: BLANC, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: GRIS }}>
                  {['Nom', 'Email', 'Téléphone', 'Statut', 'Setup payé', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', color: '#666', fontWeight: '600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commercants.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: '1px solid #f0f0f0', backgroundColor: i % 2 === 0 ? BLANC : '#fafafa' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#333' }}>{c.nom}</td>
                    <td style={{ padding: '14px 16px', color: '#666', fontSize: '14px' }}>{c.email}</td>
                    <td style={{ padding: '14px 16px', color: '#666', fontSize: '14px' }}>{c.telephone || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ backgroundColor: couleurStatut(c.statutAbonnement) + '22', color: couleurStatut(c.statutAbonnement), padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                        {c.statutAbonnement}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: c.stripeSetupPaid ? VERT : ROUGE, fontWeight: 'bold' }}>
                        {c.stripeSetupPaid ? '✅' : '❌'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
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

        {onglet === 'clients' && (
          <div style={{ backgroundColor: BLANC, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
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
                    <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#333' }}>{c.nom}</td>
                    <td style={{ padding: '14px 16px', color: '#666', fontSize: '14px' }}>{c.email}</td>
                    <td style={{ padding: '14px 16px', color: VIOLET, fontWeight: 'bold' }}>{c._count.tampons}</td>
                    <td style={{ padding: '14px 16px', color: '#666', fontSize: '14px' }}>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {onglet === 'scans' && (
          <div style={{ backgroundColor: BLANC, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
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
                    <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#333' }}>{s.client?.nom}</td>
                    <td style={{ padding: '14px 16px', color: '#666', fontSize: '14px' }}>{s.carte?.commercant?.nom}</td>
                    <td style={{ padding: '14px 16px', color: '#666', fontSize: '14px' }}>{new Date(s.createdAt).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}