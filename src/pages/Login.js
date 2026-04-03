import React, { useState } from 'react';
import axios from 'axios';

const API = 'https://fid-lepro-production.up.railway.app';

const VIOLET = '#6637ee';
const BLANC = '#ffffff';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);

    // Tentative connexion admin
    try {
      const res = await axios.post(`${API}/api/auth/connexion/admin`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'admin');
      window.location.href = '/admin';
      return;
    } catch {}

    // Tentative connexion commerçant
    try {
      const res = await axios.post(`${API}/api/auth/connexion/commercant`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'commercant');
      window.location.href = '/dashboard';
      return;
    } catch (err) {
      const statut = err?.response?.data?.statut;
      if (statut === 'inactif') {
        setErreur('Votre compte est en attente de paiement.');
      } else if (statut === 'suspendu') {
        setErreur('Votre compte est suspendu. Contactez le support.');
      } else if (statut === 'résilié') {
        setErreur('Votre abonnement est résilié.');
      } else if (statut === 'impayé') {
        setErreur('Votre abonnement est impayé. Régularisez votre situation.');
      } else {
        setErreur('Email ou mot de passe incorrect');
      }
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${VIOLET}, #9b59b6)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '24px',
    }}>
      <div style={{
        backgroundColor: BLANC,
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <h1 style={{ textAlign: 'center', color: VIOLET, marginBottom: '8px', fontSize: '32px' }}>
          FidèlePro
        </h1>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '32px', fontSize: '15px' }}>
          Connexion à votre espace
        </p>

        {erreur && (
          <div style={{
            backgroundColor: '#ffe0e0',
            color: '#c00',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px',
          }}>
            {erreur}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: '2px solid #eee',
                fontSize: '15px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              placeholder="votre@email.com"
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#333', fontSize: '14px' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                border: '2px solid #eee',
                fontSize: '15px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: VIOLET,
              color: BLANC,
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;