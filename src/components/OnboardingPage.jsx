import { useState } from 'react'
import { C } from '../lib/constants'

export default function OnboardingPage({ onDone }) {
  const [name, setName] = useState('')
  const [focus, setFocus] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    if (!name.trim()) return
    localStorage.setItem('fp_name', name.trim())
    onDone(name.trim())
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans',sans-serif", padding: '0 24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Cercles flous */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(47,129,247,0.1) 0%, transparent 70%)',
        top: -100, left: -100, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        bottom: -60, right: -60, pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 360, animation: 'fadeIn .4s ease both', position: 'relative' }}>

        {/* Emoji */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>👋</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: '-0.3px', marginBottom: 8 }}>
            Bienvenue !
          </div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.5 }}>
            Comment tu t'appelles ?<br/>
            <span style={{ fontSize: 12 }}>Pour personnaliser l'app sur cet appareil.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Marie, Vincent…"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            style={{
              width: '100%', padding: '16px 18px', borderRadius: 14,
              background: C.surface2, color: C.text,
              border: `1.5px solid ${focus ? '#2F81F7' : C.border}`,
              fontSize: 18, fontWeight: 600, outline: 'none',
              boxSizing: 'border-box', fontFamily: "'DM Sans',sans-serif",
              marginBottom: 16, transition: 'border .15s',
              boxShadow: focus ? '0 0 0 3px rgba(47,129,247,0.15)' : 'none',
              textAlign: 'center',
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />

          <button
            type="submit"
            disabled={!name.trim()}
            style={{
              width: '100%', padding: '15px',
              background: name.trim()
                ? 'linear-gradient(135deg, #2F81F7 0%, #7C3AED 100%)'
                : C.surface3,
              color: '#fff', fontWeight: 800, fontSize: 16, border: 'none',
              borderRadius: 14, cursor: name.trim() ? 'pointer' : 'not-allowed',
              fontFamily: "'DM Sans',sans-serif",
              boxShadow: name.trim() ? '0 4px 20px rgba(47,129,247,0.35)' : 'none',
              transition: 'all .15s',
            }}
          >
            C'est parti 🚀
          </button>
        </form>
      </div>
    </div>
  )
}
