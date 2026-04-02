import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://fid-lepro-production.up.railway.app';

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState('dashboard');
  const token = localStorage.getItem('token');
  useEffect(() => {
    axios.get(`${API}/api/commercant/clients`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setClients(res.data.clients))
      .catch(err => console.log(err));
  }, []);

  const deconnexion = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const totalTampons = clients.reduce((sum, c) => sum + c.totalTampons, 0);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ width: '260px', background: 'linear-gradient(180deg, #1a1a2e, #16213e)', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '30px' }}>
          FidelePro
        </div>
        {['dashboard', 'clients', 'cartes', 'notifications', 'avis'].map(item => (
          <button key={item} onClick={() => setPage(item)} style={{ background: page === item ? 'rgba(102,126,234,0.3)' : 'transparent', border: 'none', color: page === item ? 'white' : '#888', padding: '12px 16px', borderRadius: '10px', textAlign: 'left', fontSize: '15px', cursor: 'pointer' }}>
            {item}
          </button>
        ))}
        <button onClick={deconnexion} style={{ marginTop: 'auto', background: 'rgba(255,100,100,0.15)', border: 'none', color: '#ff6b6b', padding: '12px 16px', borderRadius: '10px', textAlign: 'left', fontSize: '15px', cursor: 'pointer' }}>
          Deconnexion
        </button>
      </div>
      <div style={{ flex: 1, padding: '40px', background: '#f0f2f5' }}>
        {page === 'dashboard' && (
          <div>
            <h2 style={{ marginBottom: '30px', color: '#1a1a2e' }}>Bienvenue sur votre dashboard</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderLeft: '5px solid #667eea' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>{clients.length}</div>
                <div style={{ color: '#999', marginTop: '6px' }}>Clients fideles</div>
              </div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderLeft: '5px solid #f093fb' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f093fb' }}>{totalTampons}</div>
                <div style={{ color: '#999', marginTop: '6px' }}>Tampons donnes</div>
              </div>
              <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderLeft: '5px solid #4facfe' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4facfe' }}>{clients.length}</div>
                <div style={{ color: '#999', marginTop: '6px' }}>Actifs ce mois</div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h3 style={{ marginBottom: '20px', color: '#1a1a2e' }}>Top clients</h3>
              {clients.length === 0 ? (
                <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Aucun client pour linstant</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f0f2f5' }}>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Client</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Email</th>
                      <th style={{ textAlign: 'center', padding: '12px', color: '#666' }}>Tampons</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Derniere visite</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f0f2f5' }}>
                        <td style={{ padding: '14px 12px', fontWeight: '600' }}>{client.nom}</td>
                        <td style={{ padding: '14px 12px', color: '#666' }}>{client.email}</td>
                        <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                          <span style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                            {client.totalTampons}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', color: '#666' }}>
                          {new Date(client.derniereScan).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
        {page === 'clients' && (
  <div>
    <h2 style={{ marginBottom: '30px', color: '#1a1a2e' }}>Mes clients</h2>
    <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
      {clients.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Aucun client pour linstant</p>
      ) : (
        clients.map((client, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #f0f2f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                {client.nom.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#1a1a2e' }}>{client.nom}</div>
                <div style={{ fontSize: '13px', color: '#999' }}>{client.email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#667eea', fontSize: '18px' }}>{client.totalTampons}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>tampons</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '14px' }}>{new Date(client.derniereScan).toLocaleDateString('fr-FR')}</div>
                <div style={{ fontSize: '12px', color: '#999' }}>derniere visite</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
        {page === 'cartes' && <h2>Mes cartes - En cours</h2>}
        {page === 'notifications' && (
  <div>
    <h2 style={{ marginBottom: '30px', color: '#1a1a2e' }}>Envoyer une notification</h2>
    <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Titre</label>
        <input type="text" placeholder="Ex: Promo du jour !" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #eee', fontSize: '15px', boxSizing: 'border-box' }} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Message</label>
        <textarea placeholder="Votre message..." rows="4" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #eee', fontSize: '15px', boxSizing: 'border-box', resize: 'vertical' }} />
      </div>
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Envoyer a</label>
        <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #eee', fontSize: '15px' }}>
          <option>Tous mes clients</option>
          <option>Clients inactifs</option>
          <option>Top clients</option>
        </select>
      </div>
      <button style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
        Envoyer la notification
      </button>
    </div>
  </div>
)}
        {page === 'avis' && (
  <div>
    <h2 style={{ marginBottom: '30px', color: '#1a1a2e' }}>Avis clients</h2>
    <div style={{ background: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
      <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>Aucun avis pour linstant</p>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default Dashboard;