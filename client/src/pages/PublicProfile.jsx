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
  const [scrollY, setScrollY] = useState(0)

  const API = 'https://linktreeclone-3kyb.onrender.com/api'

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

      {/* Graining */}
      <div style={grainStyle} />

      {/* Banner photo */}
      <div style={{
        width: '100%',
        height: '420px',
        position: 'relative',
      }}>
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={username}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              filter: 'brightness(0.75)'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(180deg, ${t.card} 0%, ${t.bg} 100%)`
          }} />
        )}

        {/*  bottom fading */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: `linear-gradient(to bottom, transparent, ${t.bg})`
        }} />

        {/* Name ,bio */}
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          left: '16px',
          right: '16px',
          zIndex: 10,
          background: 'rgba(8,6,4,0.12)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '16px 20px',
          border: '1px solid rgba(255,255,255,0.03)',
          transform: `translateY(${-scrollY * 0.3}px)`,
          opacity: Math.max(0, 1 - scrollY * 0.006),
          transition: 'opacity 0.1s ease'
        }}>
          <p style={{
            color: t.accent,
            fontSize: '10px',
            letterSpacing: '3px',
            marginBottom: '4px',
            opacity: 0.8
          }}>
            ::{username}::
          </p>
          {profile.bio && (
            <p style={{
              color: 'rgba(200,184,152,0.55)',
              fontSize: '13px',
              lineHeight: '1.6',
              margin: 0
            }}>
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Links section */}
      <div style={{
        maxWidth: '340px',
        margin: '0 auto',
        padding: '64px 20px 80px',
        position: 'relative',
        zIndex: 1
      }}>

        {links.length === 0 && (
          <p style={{
            color: t.subtext,
            textAlign: 'center',
            fontSize: '13px',
            letterSpacing: '1px',
            paddingTop: '16px'
          }}>
            ::nothing here yet::
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {links.map(link => (
            <button
              key={link._id}
              onClick={() => handleLinkClick(link)}
              style={{
                width: '100%',
                minHeight: '58px',
                padding: '14px 20px',
                borderRadius: '100px',
                background: 'rgba(20,16,12,0.55)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(160,120,64,0.08)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
                color: t.text,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                textAlign: 'left',
                transition: 'opacity 0.1s ease'
              }}
              onTouchStart={e => e.currentTarget.style.opacity = '0.6'}
              onTouchEnd={e => e.currentTarget.style.opacity = '1'}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <span style={{
                      flex: 1,
                      fontSize: '14px',
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: t.text,
                      textAlign: 'left'
                    }}>
                      {link.title}
                    </span>
                    
                    <span style={{
                      color: t.accent,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '18px'
                    }}>
                      {getIcon(link.icon)}
              </span>
                    
                    <svg width="14" height="14" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: t.subtext, flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
          ))}
        </div>

        <p style={{
          color: `${t.subtext}30`,
          fontSize: '10px',
          marginTop: '48px',
          letterSpacing: '2px',
          textAlign: 'center'
        }}>
          ::linkvault::
        </p>
      </div>
    </div>
  )
}