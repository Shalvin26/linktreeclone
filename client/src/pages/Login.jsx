import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

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
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)' }}>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: '#c9b8ff' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: '#ffb8d9' }} />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #c9b8ff, #ffb8d9)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#f0eaff' }}>LinkVault</h1>
          <p className="mt-1 text-sm" style={{ color: '#9b8ec4' }}>Your links, your way</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 border"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255,255,255,0.08)'
          }}>

          <h2 className="text-2xl font-bold mb-6" style={{ color: '#f0eaff' }}>
            Welcome back
          </h2>

          {error && (
            <div className="rounded-xl p-3 mb-4 text-sm border"
              style={{
                background: 'rgba(255,100,100,0.1)',
                borderColor: 'rgba(255,100,100,0.2)',
                color: '#ffaaaa'
              }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5"
                style={{ color: '#c9b8ff' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f0eaff',
                  caretColor: '#c9b8ff'
                }}
                onFocus={e => e.target.style.borderColor = '#c9b8ff'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5"
                style={{ color: '#c9b8ff' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#f0eaff',
                  caretColor: '#c9b8ff'
                }}
                onFocus={e => e.target.style.borderColor = '#c9b8ff'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition duration-200 mt-2"
              style={{
                background: 'linear-gradient(135deg, #c9b8ff, #ffb8d9)',
                color: '#1a1a2e',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 24px rgba(201,184,255,0.25)'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#9b8ec4' }}>
            Don't have an account?{' '}
            <Link to="/register"
              className="font-semibold transition"
              style={{ color: '#c9b8ff' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}