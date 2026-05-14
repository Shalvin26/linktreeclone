import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

export default function Analytics() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const API = 'http://localhost:8080/api'
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

  const COLORS = ['#c9b8ff', '#ffb8d9', '#b8ffd9', '#b8d9ff', '#ffd9b8']

  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)' }}>
      <p style={{ color: '#9b8ec4' }}>Loading analytics...</p>
    </div>
  )

  return (
    <div className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)' }}>

      {/* Glow */}
      <div className="fixed top-0 left-1/3 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: '#c9b8ff' }} />
      <div className="fixed bottom-0 right-1/3 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: '#ffb8d9' }} />

      {/* Navbar */}
      <nav className="border-b px-6 py-4 flex justify-between items-center relative z-10"
        style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
        <h1 className="text-xl font-bold"
          style={{ background: 'linear-gradient(135deg, #c9b8ff, #ffb8d9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          LinkVault
        </h1>
        <button onClick={() => navigate('/dashboard')}
          className="text-sm px-4 py-2 rounded-xl transition"
          style={{ background: 'rgba(201,184,255,0.1)', color: '#c9b8ff', border: '1px solid rgba(201,184,255,0.2)' }}>
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-6 relative z-10">

        <h2 className="text-2xl font-bold" style={{ color: '#f0eaff' }}>Your Analytics</h2>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-6" style={cardStyle}>
            <p className="text-sm" style={{ color: '#9b8ec4' }}>Total Page Visits</p>
            <p className="text-4xl font-bold mt-1"
              style={{ background: 'linear-gradient(135deg, #c9b8ff, #ffb8d9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stats?.totalVisits || 0}
            </p>
          </div>
          <div className="rounded-2xl p-6" style={cardStyle}>
            <p className="text-sm" style={{ color: '#9b8ec4' }}>Total Link Clicks</p>
            <p className="text-4xl font-bold mt-1"
              style={{ background: 'linear-gradient(135deg, #b8ffd9, #b8d9ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stats?.totalClicks || 0}
            </p>
          </div>
        </div>

        {/* Daily Visits Chart */}
        <div className="rounded-3xl p-6" style={cardStyle}>
          <h3 className="text-lg font-bold mb-6" style={{ color: '#f0eaff' }}>
            Visits — Last 7 Days
          </h3>
          {stats?.dailyVisits?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.dailyVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#4a4268' }} />
                <YAxis tick={{ fontSize: 11, fill: '#4a4268' }} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a2e',
                    border: '1px solid rgba(201,184,255,0.2)',
                    borderRadius: '12px',
                    color: '#f0eaff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#c9b8ff"
                  strokeWidth={3}
                  dot={{ fill: '#c9b8ff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-center py-10" style={{ color: '#4a4268' }}>
              No visit data yet
            </p>
          )}
        </div>

        {/* Pie Chart */}
        <div className="rounded-3xl p-6" style={cardStyle}>
          <h3 className="text-lg font-bold mb-6" style={{ color: '#f0eaff' }}>
            Clicks by Platform
          </h3>
          {stats?.platformStats?.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.platformStats}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={5}
                    label={({ name, percent }) =>
                      `${name || 'unknown'} ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {stats.platformStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a2e',
                      border: '1px solid rgba(201,184,255,0.2)',
                      borderRadius: '12px',
                      color: '#f0eaff'
                    }}
                    formatter={(value, name) => [value, name || 'unknown']}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: '#9b8ec4', fontSize: '12px' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Percentage Breakdown */}
              <div className="mt-6 space-y-3">
                {stats.platformStats.map((platform, index) => {
                  const percentage = stats.totalClicks > 0
                    ? ((platform.count / stats.totalClicks) * 100).toFixed(1)
                    : 0
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-sm w-24 capitalize" style={{ color: '#9b8ec4' }}>
                        {platform._id || 'unknown'}
                      </span>
                      <div className="flex-1 rounded-full h-1.5"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }} />
                      </div>
                      <span className="text-sm font-medium w-12 text-right" style={{ color: '#f0eaff' }}>
                        {percentage}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-center py-10" style={{ color: '#4a4268' }}>
              No click data yet. Share your profile to get clicks!
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
