import { useEffect } from 'react';

const VIOLET = '#6637ee';
const BLANC = '#ffffff';
const VERT = '#2ecc71';

export default function InscriptionSuccess() {
  useEffect(() => {
    // Redirection vers login après 5 secondes
    const timer = setTimeout(() => {
      window.location.href = '/login';
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
        padding: '48px 32px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: VERT,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '40px',
        }}>
          ✓
        </div>

        <h1 style={{ color: '#333', fontSize: '28px', marginBottom: '16px' }}>
          Paiement réussi !
        </h1>

        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
          Bienvenue sur FidèlePro ! Votre compte commerçant est maintenant actif.
          Vous pouvez vous connecter et commencer à fidéliser vos clients.
        </p>

        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '32px',
        }}>
          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
            🔄 Redirection automatique vers la connexion dans 5 secondes...
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/login'}
          style={{
            backgroundColor: VIOLET,
            color: BLANC,
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Se connecter maintenant
        </button>
      </div>
    </div>
  );
}