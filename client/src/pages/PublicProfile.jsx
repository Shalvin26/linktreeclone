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

  const API = 'https://linktreeclone-3kyb.onrender.com/api'

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
    // Log click
    try {
      await axios.post(`${API}/analytics/click`, {
        userId: profile._id,
        linkId: link._id,
        platform: link.icon
      })
    } catch (err) {
      console.log(err)
    }
    // Open link
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  const themeName = profile?.theme || 'midnight'
  const t = themes[themeName] || themes.midnight

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: themes.midnight.bg }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: '#c9b8ff', borderTopColor: 'transparent' }} />
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: themes.midnight.bg }}>
      <div className="text-center px-6">
        <h2 className="text-2xl font-bold" style={{ color: '#f0eaff' }}>
          User not found
        </h2>
        <p className="mt-2 text-sm" style={{ color: '#9b8ec4' }}>
          This profile doesn't exist
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen w-full"
      style={{ background: t.bg }}>

      {/* Glow blobs — hidden on small screens for performance */}
      <div className="hidden md:block fixed top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: t.glow1 }} />
      <div className="hidden md:block fixed bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: t.glow2 }} />

      {/* Main container */}
      <div className="flex flex-col items-center w-full min-h-screen"
        style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 16px 80px' }}>

        {/* Profile photo */}
        <div className="mb-5"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            padding: '3px',
            background: t.button,
            boxShadow: `0 8px 32px ${t.glow1}50`
          }}>
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
            style={{ background: t.bg }}>
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={username}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <span style={{ fontSize: '36px', fontWeight: 'bold', color: t.accent }}>
                {username[0].toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Username */}
        <h1 style={{
          color: t.text,
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          @{username}
        </h1>

        {/* Bio */}
        {profile.bio && (
          <p style={{
            color: t.subtext,
            fontSize: '14px',
            textAlign: 'center',
            lineHeight: '1.6',
            marginBottom: '32px',
            padding: '0 16px',
            maxWidth: '360px'
          }}>
            {profile.bio}
          </p>
        )}

        {/* Links */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {links.length === 0 && (
            <p style={{ color: t.subtext, textAlign: 'center', fontSize: '14px' }}>
              No links yet
            </p>
          )}

          {links.map(link => (
            <button
              key={link._id}
              onClick={() => handleLinkClick(link)}
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '14px 20px',
                borderRadius: '16px',
                background: t.card,
                border: `1px solid ${t.border}`,
                color: t.text,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                transition: 'transform 0.1s ease',
                backdropFilter: 'blur(10px)',
                textAlign: 'left'
              }}
              onTouchStart={e => {
                e.currentTarget.style.transform = 'scale(0.97)'
                e.currentTarget.style.background = `${t.accent}18`
              }}
              onTouchEnd={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.background = t.card
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${t.accent}18`
                e.currentTarget.style.borderColor = `${t.accent}50`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = t.card
                e.currentTarget.style.borderColor = t.border
              }}
            >
              {/* Platform icon */}
              <span style={{ color: t.accent, flexShrink: 0, fontSize: '20px', display: 'flex', alignItems: 'center' }}>
                {getIcon(link.icon)}
              </span>

              {/* Title */}
              <span style={{
                flex: 1,
                fontSize: '15px',
                fontWeight: '600',
                color: t.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {link.title}
              </span>

              {/* Arrow */}
              <svg width="16" height="16" fill="none" stroke="currentColor"
                viewBox="0 0 24 24" style={{ color: t.subtext, flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p style={{
          color: `${t.subtext}40`,
          fontSize: '11px',
          marginTop: '48px',
          textAlign: 'center'
        }}>
          Powered by LinkVault
        </p>

      </div>
    </div>
  )
}