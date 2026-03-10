import { useState } from 'react'
import { C } from './lib/constants'
import { useAuth } from './hooks/useAuth'
import LoginPage from './components/LoginPage'
import OnboardingPage from './components/OnboardingPage'
import FamilyPlan from './App'

// Inject Google Font (once, at root level)
if (!document.querySelector('link[data-font="dm-sans"]')) {
  const link = document.createElement('link')
  link.rel  = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'
  link.dataset.font = 'dm-sans'
  document.head.appendChild(link)
}

function SplashScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans',sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
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

      <div style={{ animation: 'fadeIn .5s ease both', textAlign: 'center' }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ marginBottom: 20 }}>
          <defs>
            <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2F81F7"/>
              <stop offset="100%" stopColor="#7C3AED"/>
            </linearGradient>
          </defs>
          <rect width="80" height="80" rx="20" fill="#161B22"/>
          <circle cx="40" cy="40" r="30" fill="url(#splashGrad)" opacity="0.13"/>
          <text x="40" y="48" fontFamily="Arial,sans-serif" fontSize="30" fontWeight="800"
            textAnchor="middle" fill="url(#splashGrad)" letterSpacing="-1">FP</text>
        </svg>

        <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.3px', marginBottom: 6 }}>
          FamilyPlan
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 40 }}>
          Planning Famille Chérie
        </div>

        <div style={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2F81F7, #7C3AED)',
              animation: `pulse 1.2s ease ${delay}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Root() {
  const { user, loading, signIn, signOut } = useAuth()
  const [userName, setUserName] = useState(() => localStorage.getItem('fp_name') || '')

  if (loading) return <SplashScreen />

  if (!user) return <LoginPage onLogin={signIn} />

  if (!userName) return <OnboardingPage onDone={setUserName} />

  return <FamilyPlan user={user} userName={userName} onSignOut={signOut} />
}
