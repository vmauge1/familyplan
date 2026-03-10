import { useState } from 'react'
import { C } from '../lib/constants'

export default function LoginPage({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await onLogin(email, password)
    if (error) setError('Email ou mot de passe incorrect')
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 12,
    background: C.surface2, color: C.text,
    border: `1px solid ${C.border}`, fontSize: 16, outline: 'none',
    boxSizing: 'border-box', fontFamily: "'DM Sans',sans-serif",
    marginBottom: 12,
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans',sans-serif", padding: '0 24px',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo / titre */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: '-0.5px' }}>
            FamilyPlan
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>
            Planning familial partagé
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
            style={inputStyle}
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
            style={{ ...inputStyle, marginBottom: 20 }}
            required
          />

          {error && (
            <div style={{
              background: '#DA363320', border: '1px solid #DA363360',
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
              width: '100%', padding: '15px', background: loading ? C.surface3 : C.accent,
              color: '#fff', fontWeight: 800, fontSize: 16, border: 'none',
              borderRadius: 14, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans',sans-serif", transition: 'background .15s',
            }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
