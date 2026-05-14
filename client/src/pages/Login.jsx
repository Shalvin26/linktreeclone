import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

// Grain overlay style
const grainStyle = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100%', height: '100%',
  pointerEvents: 'none',
  zIndex: 0,
  opacity: 0.08,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'repeat',
  backgroundSize: '128px 128px'
}

const inputStyle = {
  background: '#111111',
  border: '1px solid rgba(160,120,64,0.2)',
  color: '#e8e0d0',
  caretColor: '#a07840',
  width: '100%',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s'
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('https://linktreeclone-3kyb.onrender.com/api/auth/login', {
        email, password
      })
      login(res.data.token, res.data.username)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative' }}>

      {/* Grain */}
      <div style={grainStyle} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#a07840', fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>
            ::LinkVault::
          </p>
          <h1 style={{ color: '#e8e0d0', fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Welcome back.
          </h1>
          <p style={{ color: '#6a6258', fontSize: '13px' }}>
            your links. your world.
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#111111', border: '1px solid rgba(160,120,64,0.15)', borderRadius: '20px', padding: '32px' }}>

          {error && (
            <div style={{ background: 'rgba(160,60,60,0.1)', border: '1px solid rgba(160,60,60,0.2)', color: '#c08080', borderRadius: '10px', padding: '12px', marginBottom: '20px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#6a6258', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#a07840'}
                onBlur={e => e.target.style.borderColor = 'rgba(160,120,64,0.2)'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#6a6258', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#a07840'}
                onBlur={e => e.target.style.borderColor = 'rgba(160,120,64,0.2)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '12px',
                background: loading ? '#2a2a2a' : 'linear-gradient(135deg, #a07840, #c49a50)',
                color: loading ? '#6a6258' : '#0a0a0a',
                fontWeight: '700',
                fontSize: '14px',
                letterSpacing: '1px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? '— signing in —' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#6a6258', fontSize: '13px', marginTop: '24px' }}>
            no account?{' '}
            <Link to="/register" style={{ color: '#a07840', textDecoration: 'none', fontWeight: '600' }}>
              create one
            </Link>
          </p>
        </div>

        {/* Footer signature */}
        <p style={{ textAlign: 'center', color: '#2a2520', fontSize: '11px', marginTop: '24px', letterSpacing: '2px' }}>
          ::made for the ones who create::
        </p>

      </div>
    </div>
  )
}