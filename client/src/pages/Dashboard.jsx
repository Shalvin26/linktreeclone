import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

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

const cardStyle = {
  background: '#111111',
  border: '1px solid rgba(160,120,64,0.15)',
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '16px'
}

export default function Analytics() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const API = 'https://linktreeclone-3kyb.onrender.com/api'
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) navigate('/login')
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/analytics/stats`, { headers })
      setStats(res.data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const COLORS = ['#a07840', '#c49a50', '#806030', '#d4aa60', '#604820']

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a07840', letterSpacing: '2px', fontSize: '13px' }}>::loading::</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', position: 'relative' }}>

      {/* Grain */}
      <div style={grainStyle} />

      {/* Navbar */}
      <nav style={{
        background: '#0f0f0f',
        borderBottom: '1px solid rgba(160,120,64,0.1)',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <p style={{ color: '#a07840', fontSize: '12px', letterSpacing: '3px' }}>
          ::LinkVault::
        </p>
        <button onClick={() => navigate('/dashboard')}
          style={{ background: 'rgba(160,120,64,0.08)', border: '1px solid rgba(160,120,64,0.2)', color: '#a07840', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer' }}>
          ← dashboard
        </button>
      </nav>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px 80px', position: 'relative', zIndex: 1 }}>

        <p style={{ color: '#a07840', fontSize: '11px', letterSpacing: '3px', marginBottom: '6px' }}>
          ::analytics::
        </p>
        <h2 style={{ color: '#e8e0d0', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
          your numbers.
        </h2>

        {/* Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <p style={{ color: '#3a3228', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>
              PAGE VISITS
            </p>
            <p style={{ color: '#a07840', fontSize: '36px', fontWeight: '700', letterSpacing: '-1px' }}>
              {stats?.totalVisits || 0}
            </p>
          </div>
          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <p style={{ color: '#3a3228', fontSize: '11px', letterSpacing: '1px', marginBottom: '8px' }}>
              LINK CLICKS
            </p>
            <p style={{ color: '#a07840', fontSize: '36px', fontWeight: '700', letterSpacing: '-1px' }}>
              {stats?.totalClicks || 0}
            </p>
          </div>
        </div>

        {/* Line Chart */}
        <div style={cardStyle}>
          <p style={{ color: '#a07840', fontSize: '11px', letterSpacing: '2px', marginBottom: '20px' }}>
            ::visits — last 7 days::
          </p>
          {stats?.dailyVisits?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(160,120,64,0.08)" />
                <XAxis dataKey="_id" tick={{ fontSize: 10, fill: '#3a3228' }} />
                <YAxis tick={{ fontSize: 10, fill: '#3a3228' }} />
                <Tooltip contentStyle={{ background: '#111111', border: '1px solid rgba(160,120,64,0.2)', borderRadius: '10px', color: '#e8e0d0', fontSize: '12px' }} />
                <Line type="monotone" dataKey="count" stroke="#a07840" strokeWidth={2}
                  dot={{ fill: '#a07840', strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#3a3228', fontSize: '13px', textAlign: 'center', padding: '32px 0' }}>
              no data yet.
            </p>
          )}
        </div>

        {/* Pie Chart */}
        <div style={cardStyle}>
          <p style={{ color: '#a07840', fontSize: '11px', letterSpacing: '2px', marginBottom: '20px' }}>
            ::clicks by platform::
          </p>
          {stats?.platformStats?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={stats.platformStats}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={4}
                    label={({ name, percent }) => `${name || '?'} ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.platformStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#111111', border: '1px solid rgba(160,120,64,0.2)', borderRadius: '10px', color: '#e8e0d0', fontSize: '12px' }}
                    formatter={(value, name) => [value, name || 'unknown']}
                  />
                  <Legend formatter={(value) => (
                    <span style={{ color: '#6a6258', fontSize: '11px' }}>{value}</span>
                  )} />
                </PieChart>
              </ResponsiveContainer>

              {/* Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                {stats.platformStats.map((platform, index) => {
                  const percentage = stats.totalClicks > 0
                    ? ((platform.count / stats.totalClicks) * 100).toFixed(1) : 0
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length], flexShrink: 0 }} />
                      <span style={{ color: '#6a6258', fontSize: '12px', width: '80px', textTransform: 'capitalize' }}>
                        {platform._id || 'unknown'}
                      </span>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '4px', height: '4px' }}>
                        <div style={{ width: `${percentage}%`, height: '4px', borderRadius: '4px', background: COLORS[index % COLORS.length] }} />
                      </div>
                      <span style={{ color: '#e8e0d0', fontSize: '12px', width: '40px', textAlign: 'right' }}>
                        {percentage}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <p style={{ color: '#3a3228', fontSize: '13px', textAlign: 'center', padding: '32px 0' }}>
              no clicks yet. share your profile.
            </p>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#2a2520', fontSize: '11px', letterSpacing: '2px', marginTop: '24px' }}>
          ::numbers don't lie::
        </p>

      </div>
    </div>
  )
}