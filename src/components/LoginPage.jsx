import { useState } from 'react'
import { C } from '../lib/constants'

export default function LoginPage({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [focusField, setFocus]  = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await onLogin(email, password)
    if (error) setError('Email ou mot de passe incorrect')
    setLoading(false)
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '14px 16px', borderRadius: 12,
    background: C.surface2, color: C.text,
    border: `1.5px solid ${focusField === field ? '#2F81F7' : C.border}`,
    fontSize: 16, outline: 'none',
    boxSizing: 'border-box', fontFamily: "'DM Sans',sans-serif",
    marginBottom: 14, transition: 'border .15s',
    boxShadow: focusField === field ? '0 0 0 3px rgba(47,129,247,0.15)' : 'none',
  })

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans',sans-serif", padding: '0 24px',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Cercles flous en arrière-plan */}
      <div style={{
        position: 'absolute', width: 340, height: 340, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(47,129,247,0.12) 0%, transparent 70%)',
        top: -80, left: -80, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)',
        bottom: -60, right: -60, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(47,129,247,0.07) 0%, transparent 70%)',
        bottom: 100, left: 20, pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 380, position: 'relative' }}>

        {/* Logo FP */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 22, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #0D1117 0%, #161B22 100%)',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(47,129,247,0.25), 0 0 0 1px rgba(47,129,247,0.3)',
          }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2F81F7"/>
                  <stop offset="100%" stopColor="#7C3AED"/>
                </linearGradient>
              </defs>
              <rect width="80" height="80" rx="20" fill="#0D1117"/>
              <circle cx="40" cy="40" r="30" fill="url(#logoGrad)" opacity="0.13"/>
              <text x="40" y="48" fontFamily="Arial,sans-serif" fontSize="30" fontWeight="800"
                textAnchor="middle" fill="url(#logoGrad)" letterSpacing="-1">FP</text>
            </svg>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>
            FamilyPlan
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 5 }}>
            Planning Famille Chérie
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Email
          </div>
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle('email')}
            onFocus={() => setFocus('email')}
            onBlur={() => setFocus(null)}
            required
            autoFocus
          />

          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Mot de passe
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ ...inputStyle('password'), marginBottom: 22 }}
            onFocus={() => setFocus('password')}
            onBlur={() => setFocus(null)}
            required
          />

          {error && (
            <div style={{
              background: '#DA363318', border: '1px solid #DA363350',
              borderRadius: 10, padding: '12px 16px', marginBottom: 16,
              fontSize: 14, color: '#DA3633', textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '15px',
              background: loading ? C.surface3 : 'linear-gradient(135deg, #2F81F7 0%, #7C3AED 100%)',
              color: '#fff', fontWeight: 800, fontSize: 16, border: 'none',
              borderRadius: 14, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans',sans-serif",
              boxShadow: loading ? 'none' : '0 4px 20px rgba(47,129,247,0.35)',
              transition: 'opacity .15s',
            }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
