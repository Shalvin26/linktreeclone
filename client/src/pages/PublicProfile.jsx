import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import themes from '../themes'
import getIcon from '../utils/getIcon'

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

export default function PublicProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const API = 'https://linktreeclone-3kyb.onrender.com/api'

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    try {
      const profileRes = await axios.get(`${API}/profile/${username}`)
      setProfile(profileRes.data)
      await axios.post(`${API}/analytics/visit`, { userId: profileRes.data._id })
      const linksRes = await axios.get(`${API}/links/public/${username}`)
      setLinks(linksRes.data)
      setLoading(false)
    } catch (err) {
      setNotFound(true)
      setLoading(false)
    }
  }

  const handleLinkClick = async (link) => {
    window.location.href = link.url
    try {
      await axios.post(`${API}/analytics/click`, {
        userId: profile._id,
        linkId: link._id,
        platform: link.icon
      })
    } catch (err) {
      console.log(err)
    }
  }

  const themeName = profile?.theme || 'midnight'
  const t = themes[themeName] || themes.midnight

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a07840', letterSpacing: '3px', fontSize: '12px' }}>::loading::</p>
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#a07840', fontSize: '11px', letterSpacing: '3px', marginBottom: '12px' }}>::404::</p>
        <h2 style={{ color: '#e8e0d0', fontSize: '22px', fontWeight: '700' }}>not found.</h2>
        <p style={{ color: '#3a3228', fontSize: '13px', marginTop: '8px' }}>this vault doesn't exist.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: t.bg, position: 'relative' }}>

      {/* Grain */}
      <div style={grainStyle} />

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '60px 16px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>

        {/* Profile photo */}
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%',
          background: t.button, padding: '2px',
          marginBottom: '16px', flexShrink: 0
        }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: t.bg, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {profile.photo ? (
              <img src={profile.photo} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: t.accent, fontSize: '32px', fontWeight: '700' }}>
                {username[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Signature */}
        <p style={{ color: t.accent, fontSize: '10px', letterSpacing: '3px', marginBottom: '6px' }}>
          ::{username}::
        </p>

        {/* Bio */}
        {profile.bio && (
          <p style={{ color: t.subtext, fontSize: '13px', textAlign: 'center', lineHeight: '1.7', marginBottom: '40px', maxWidth: '320px' }}>
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {links.length === 0 && (
            <p style={{ color: t.subtext, textAlign: 'center', fontSize: '13px', letterSpacing: '1px' }}>
              ::nothing here yet::
            </p>
          )}
          {links.map(link => (
            <button key={link._id}
              onClick={() => handleLinkClick(link)}
              style={{
                width: '100%',
                minHeight: '58px',
                padding: '14px 18px',
                borderRadius: '14px',
                background: t.card,
                border: `1px solid ${t.border}`,
                color: t.text,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                textAlign: 'left',
                transition: 'opacity 0.1s'
              }}
              onTouchStart={e => e.currentTarget.style.opacity = '0.7'}
              onTouchEnd={e => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ color: t.accent, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {getIcon(link.icon)}
              </span>
              <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {link.title}
              </span>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: t.subtext, flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p style={{ color: `${t.subtext}30`, fontSize: '10px', marginTop: '48px', letterSpacing: '2px' }}>
          ::linkvault::
        </p>

      </div>
    </div>
  )
}