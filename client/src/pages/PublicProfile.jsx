import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import themes from '../themes'
import getIcon from '../utils/getIcon'


export default function PublicProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
 
  const API = 'http://localhost:8080/api'

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    try {
      const profileRes = await axios.get(`${API}/profile/${username}`)
      setProfile(profileRes.data)
      await axios.post(`${API}/analytics/visit`, {
        userId: profileRes.data._id
      })
      const linksRes = await axios.get(`${API}/links/public/${username}`)
      setLinks(linksRes.data)
      setLoading(false)
    } catch (err) {
      setNotFound(true)
      setLoading(false)
    }
  }

  const handleLinkClick = async (link) => {
    try {
      await axios.post(`${API}/analytics/click`, {
        userId: profile._id,
        linkId: link._id,
        platform: link.icon
      })
    } catch (err) {
      console.log(err)
    }
    window.open(link.url, '_blank')
  }
  const themeName = profile?.theme || 'midnight'
  const t = themes[themeName] || themes.midnight

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: themes.midnight.bg }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#c9b8ff', borderTopColor: 'transparent' }} />
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: themes.midnight.bg }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold" style={{ color: '#f0eaff' }}>
          User not found
        </h2>
        <p className="mt-2" style={{ color: '#9b8ec4' }}>
          This profile doesn't exist
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen transition-all duration-500"
      style={{ background: t.bg }}>

      {/* Glow blobs */}
      <div className="fixed top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none transition-all duration-500"
        style={{ background: t.glow1 }} />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none transition-all duration-500"
        style={{ background: t.glow2 }} />
      {/* Content */}
      <div className="flex flex-col items-center px-4 pb-16 relative z-10"
        style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* Profile photo */}
        <div className="mt-4 mb-6 relative">
          <div className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: t.button,
              boxShadow: `0 8px 32px ${t.glow1}40`,
              padding: '3px'
            }}>
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
              style={{ background: t.bg }}>
              {profile.photo ? (
                <img src={profile.photo} alt={username}
                  className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-4xl font-bold"
                  style={{ color: t.accent }}>
                  {username[0].toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Name + bio */}
        <h1 className="text-2xl font-bold mb-1" style={{ color: t.text }}>
          @{username}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center mb-6 px-4 leading-relaxed"
            style={{ color: t.subtext }}>
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div className="w-full space-y-3 mt-4">
          {links.length === 0 && (
            <p className="text-center text-sm" style={{ color: t.subtext }}>
              No links yet
            </p>
          )}
          {links.map(link => (
            <button
              key={link._id}
              onClick={() => handleLinkClick(link)}
              className="w-full py-4 px-5 rounded-2xl font-medium text-sm
                         flex items-center gap-3 transition-all duration-200 active:scale-95"
              style={{
                background: t.card,
                border: `1px solid ${t.border}`,
                color: t.text,
                backdropFilter: 'blur(10px)',
                minHeight: '56px'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${t.accent}18`
                e.currentTarget.style.borderColor = `${t.accent}50`
                e.currentTarget.style.boxShadow = `0 4px 20px ${t.accent}20`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = t.card
                e.currentTarget.style.borderColor = t.border
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Icon */}
              <span style={{ color: t.accent, flexShrink: 0 }}>
                {getIcon(link.icon)}
              </span>

              {/* Title */}
              <span className="flex-1 text-left">{link.title}</span>

              {/* Arrow */}
              <svg className="w-4 h-4 flex-shrink-0"
                style={{ color: t.subtext }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

       
      </div>
    </div>
  )
}