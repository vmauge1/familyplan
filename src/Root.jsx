import { C } from './lib/constants'
import { useAuth } from './hooks/useAuth'
import LoginPage from './components/LoginPage'
import FamilyPlan from './App'

// Inject Google Font (once, at root level)
if (!document.querySelector('link[data-font="dm-sans"]')) {
  const link = document.createElement('link')
  link.rel  = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'
  link.dataset.font = 'dm-sans'
  document.head.appendChild(link)
}

export default function Root() {
  const { user, loading, signIn, signOut } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: C.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.accent, animation: 'pulse 1.4s infinite' }} />
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={signIn} />
  }

  return <FamilyPlan user={user} onSignOut={signOut} />
}
