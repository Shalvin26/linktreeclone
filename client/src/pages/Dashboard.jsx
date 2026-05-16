import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import themes from '../themes'

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
  padding: '20px',
  marginBottom: '12px'
}

const inputStyle = {
  background: '#0a0a0a',
  border: '1px solid rgba(160,120,64,0.2)',
  color: '#e8e0d0',
  caretColor: '#a07840',
  width: '100%',
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
  WebkitAppearance: 'none'
}

const labelStyle = {
  color: '#6a6258',
  fontSize: '11px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '8px'
}

const btnPrimary = {
  background: 'linear-gradient(135deg, #a07840, #c49a50)',
  color: '#0a0a0a',
  border: 'none',
  padding: '14px 24px',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: '700',
  cursor: 'pointer',
  letterSpacing: '0.5px',
  WebkitTapHighlightColor: 'transparent',
  minHeight: '48px'
}

export default function Dashboard() {
  const { token, username, logout } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState({ bio: '', photo: '', theme: 'midnight' })
  const [bio, setBio] = useState('')
  const [photo, setPhoto] = useState('')
  const [photoLoading, setPhotoLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [links, setLinks] = useState([])
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: '' })
  const [editingLink, setEditingLink] = useState(null)
  const [linkMsg, setLinkMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const API = 'https://linktreeclone-3kyb.onrender.com/api'
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) navigate('/login')
  }, [token])

  useEffect(() => {
    if (!username) return
    fetchProfile()
    fetchLinks()
  }, [username])

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/profile/${username}`)
      setProfile(res.data)
      setBio(res.data.bio || '')
      setPhoto(res.data.photo || '')
    } catch (err) {
      console.log(err)
    }
  }

  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${API}/links`, { headers })
      setLinks(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      await axios.put(`${API}/profile/update`, { bio, theme: profile.theme }, { headers })
      setProfileMsg('::saved::')
      setTimeout(() => setProfileMsg(''), 3000)
    } catch (err) {
      console.log(err)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoLoading(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)
      const res = await axios.post(`${API}/profile/photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setPhoto(res.data.photo)
      setProfileMsg('::photo updated::')
      setTimeout(() => setProfileMsg(''), 3000)
    } catch (err) {
      console.log(err)
    }
    setPhotoLoading(false)
  }

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) return
    try {
      const res = await axios.post(`${API}/links`, newLink, { headers })
      setLinks([...links, res.data])
      setNewLink({ title: '', url: '', icon: '' })
      setLinkMsg('::link added::')
      setTimeout(() => setLinkMsg(''), 3000)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteLink = async (id) => {
    try {
      await axios.delete(`${API}/links/${id}`, { headers })
      setLinks(links.filter(l => l._id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  const handleToggle = async (link) => {
    try {
      const res = await axios.put(`${API}/links/${link._id}`,
        { isActive: !link.isActive }, { headers })
      setLinks(links.map(l => l._id === link._id ? res.data : l))
    } catch (err) {
      console.log(err)
    }
  }

  const handleEditLink = async () => {
    try {
      const res = await axios.put(`${API}/links/${editingLink._id}`,
        editingLink, { headers })
      setLinks(links.map(l => l._id === editingLink._id ? res.data : l))
      setEditingLink(null)
      setLinkMsg('::link updated::')
      setTimeout(() => setLinkMsg(''), 3000)
    } catch (err) {
      console.log(err)
    }
  }

  const handleThemeChange = async (key) => {
    try {
      await axios.put(`${API}/profile/update`, { bio, theme: key }, { headers })
      setProfile({ ...profile, theme: key })
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const tabs = ['profile', 'links', 'theme']

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', position: 'relative', paddingBottom: '100px' }}>

      {/* Grain */}
      <div style={grainStyle} />

      {/* Navbar */}
      <nav style={{
        background: '#0f0f0f',
        borderBottom: '1px solid rgba(160,120,64,0.1)',
        padding: '14px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <p style={{ color: '#a07840', fontSize: '12px', letterSpacing: '3px' }}>
          ::LinkVault::
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => navigate(`/${username}`)}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.05)', color: '#6a6258', padding: '8px 12px', borderRadius: '10px', fontSize: '11px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            preview
          </button>
          <button onClick={handleLogout}
            style={{ background: 'transparent', border: '1px solid rgba(160,60,60,0.2)', color: '#805050', padding: '8px 12px', borderRadius: '10px', fontSize: '11px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            logout
          </button>
        </div>
      </nav>

      {/* Shareable Link */}
      <div style={{ padding: '16px 16px 0', position: 'relative', zIndex: 1 }}>
        <div style={cardStyle}>
          <p style={{ color: '#a07840', fontSize: '10px', letterSpacing: '2px', marginBottom: '12px' }}>
            ::your link::
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0a0a0a', border: '1px solid rgba(160,120,64,0.15)', borderRadius: '12px', padding: '10px 14px' }}>
            <span style={{ flex: 1, color: '#a07840', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              linktreeclone-black.vercel.app/{username}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://linktreeclone-black.vercel.app/${username}`)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              style={{ background: copied ? 'rgba(160,120,64,0.2)' : 'linear-gradient(135deg, #a07840, #c49a50)', color: copied ? '#a07840' : '#0a0a0a', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', flexShrink: 0, WebkitTapHighlightColor: 'transparent', minHeight: '36px' }}>
              {copied ? '::copied::' : 'copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: '0 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#111111', borderRadius: '14px', padding: '6px', border: '1px solid rgba(160,120,64,0.1)' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '11px',
                letterSpacing: '1px',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                background: activeTab === tab ? 'linear-gradient(135deg, #a07840, #c49a50)' : 'transparent',
                color: activeTab === tab ? '#0a0a0a' : '#4a4238',
                fontWeight: activeTab === tab ? '700' : '400',
                transition: 'all 0.2s'
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div style={cardStyle}>
              <p style={{ color: '#a07840', fontSize: '10px', letterSpacing: '2px', marginBottom: '20px' }}>
                ::profile::
              </p>

              {/* Photo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a07840, #c49a50)',
                  padding: '2px', flexShrink: 0
                }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0a0a0a', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {photo ? (
                      <img src={photo} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#a07840', fontSize: '24px', fontWeight: '700' }}>
                        {username?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="photo-upload"
                    style={{ display: 'block', background: 'rgba(160,120,64,0.08)', border: '1px solid rgba(160,120,64,0.2)', color: '#a07840', padding: '10px 16px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.5px', textAlign: 'center', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {photoLoading ? '::uploading::' : 'upload photo'}
                  </label>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                  <p style={{ color: '#3a3228', fontSize: '10px', marginTop: '6px', textAlign: 'center' }}>jpg, png, webp</p>
                </div>
              </div>

              <label style={labelStyle}>bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="write something..."
                rows={3}
                style={{ ...inputStyle, resize: 'none', marginBottom: '16px', fontSize: '16px' }}
                onFocus={e => e.target.style.borderColor = '#a07840'}
                onBlur={e => e.target.style.borderColor = 'rgba(160,120,64,0.2)'}
              />

              <button onClick={handleProfileUpdate} style={{ ...btnPrimary, width: '100%' }}>
                save profile
              </button>
              {profileMsg && <p style={{ color: '#a07840', fontSize: '12px', marginTop: '10px', letterSpacing: '1px', textAlign: 'center' }}>{profileMsg}</p>}
            </div>

            {/* Analytics shortcut */}
            <button onClick={() => navigate('/analytics')}
              style={{ width: '100%', background: 'rgba(160,120,64,0.06)', border: '1px solid rgba(160,120,64,0.15)', color: '#6a6258', padding: '14px', borderRadius: '14px', fontSize: '12px', cursor: 'pointer', letterSpacing: '1px', WebkitTapHighlightColor: 'transparent' }}>
              view analytics →
            </button>
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div>
            {/* Add Link */}
            <div style={cardStyle}>
              <p style={{ color: '#a07840', fontSize: '10px', letterSpacing: '2px', marginBottom: '16px' }}>
                ::add link::
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>title</label>
                  <input type="text" placeholder="My Instagram"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#a07840'}
                    onBlur={e => e.target.style.borderColor = 'rgba(160,120,64,0.2)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>url</label>
                  <input type="url" placeholder="https://instagram.com/yourname"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#a07840'}
                    onBlur={e => e.target.style.borderColor = 'rgba(160,120,64,0.2)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>platform</label>
                  <input type="text" placeholder="instagram / linkedin / github"
                    value={newLink.icon}
                    onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#a07840'}
                    onBlur={e => e.target.style.borderColor = 'rgba(160,120,64,0.2)'}
                  />
                </div>
                <button onClick={handleAddLink} style={{ ...btnPrimary, width: '100%' }}>
                  + add link
                </button>
              </div>
              {linkMsg && <p style={{ color: '#a07840', fontSize: '12px', marginTop: '10px', letterSpacing: '1px', textAlign: 'center' }}>{linkMsg}</p>}
            </div>

            {/* Links List */}
            <div style={cardStyle}>
              <p style={{ color: '#a07840', fontSize: '10px', letterSpacing: '2px', marginBottom: '16px' }}>
                ::your links:: <span style={{ color: '#3a3228' }}>({links.length})</span>
              </p>

              {links.length === 0 && (
                <p style={{ color: '#3a3228', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
                  no links yet.
                </p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(link => (
                  <div key={link._id}
                    style={{
                      background: '#0a0a0a',
                      border: `1px solid ${link.isActive ? 'rgba(160,120,64,0.15)' : 'rgba(255,255,255,0.04)'}`,
                      borderRadius: '14px',
                      padding: '14px',
                      opacity: link.isActive ? 1 : 0.4
                    }}>

                    {editingLink?._id === link._id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input value={editingLink.title}
                          onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = '#a07840'}
                          onBlur={e => e.target.style.borderColor = 'rgba(160,120,64,0.2)'}
                        />
                        <input value={editingLink.url}
                          onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                          style={inputStyle}
                          onFocus={e => e.target.style.borderColor = '#a07840'}
                          onBlur={e => e.target.style.borderColor = 'rgba(160,120,64,0.2)'}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={handleEditLink}
                            style={{ ...btnPrimary, flex: 1, padding: '10px' }}>
                            save
                          </button>
                          <button onClick={() => setEditingLink(null)}
                            style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#6a6258', padding: '10px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer', minHeight: '44px' }}>
                            cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <p style={{ color: '#e8e0d0', fontSize: '14px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                            {link.title}
                          </p>
                          <span style={{ color: '#a07840', fontSize: '11px', flexShrink: 0, marginLeft: '8px' }}>
                            {link.clicks} clicks
                          </span>
                        </div>
                        <p style={{ color: '#3a3228', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '10px' }}>
                          {link.url}
                        </p>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleToggle(link)}
                            style={{ flex: 1, background: 'transparent', border: `1px solid ${link.isActive ? 'rgba(160,120,64,0.3)' : 'rgba(255,255,255,0.05)'}`, color: link.isActive ? '#a07840' : '#3a3228', padding: '8px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', minHeight: '36px', WebkitTapHighlightColor: 'transparent' }}>
                            {link.isActive ? 'on' : 'off'}
                          </button>
                          <button onClick={() => setEditingLink(link)}
                            style={{ flex: 1, background: 'transparent', border: '1px solid rgba(160,180,255,0.15)', color: '#8090c0', padding: '8px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', minHeight: '36px', WebkitTapHighlightColor: 'transparent' }}>
                            edit
                          </button>
                          <button onClick={() => handleDeleteLink(link._id)}
                            style={{ flex: 1, background: 'transparent', border: '1px solid rgba(160,60,60,0.2)', color: '#805050', padding: '8px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', minHeight: '36px', WebkitTapHighlightColor: 'transparent' }}>
                            del
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div style={cardStyle}>
            <p style={{ color: '#a07840', fontSize: '10px', letterSpacing: '2px', marginBottom: '20px' }}>
              ::theme::
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {Object.entries(themes).map(([key, theme]) => (
                <button key={key} onClick={() => handleThemeChange(key)}
                  style={{
                    background: theme.card,
                    border: `2px solid ${profile.theme === key ? theme.accent : 'rgba(255,255,255,0.05)'}`,
                    borderRadius: '16px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    WebkitTapHighlightColor: 'transparent',
                    minHeight: '80px'
                  }}>
                  <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: theme.button }} />
                  <span style={{ color: profile.theme === key ? theme.accent : '#3a3228', fontSize: '10px', letterSpacing: '1px' }}>
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#0f0f0f',
        borderTop: '1px solid rgba(160,120,64,0.1)',
        padding: '12px 16px',
        display: 'flex',
        gap: '8px',
        zIndex: 100
      }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '11px',
              letterSpacing: '1px',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              background: activeTab === tab ? 'linear-gradient(135deg, #a07840, #c49a50)' : 'transparent',
              color: activeTab === tab ? '#0a0a0a' : '#4a4238',
              fontWeight: activeTab === tab ? '700' : '400'
            }}>
            {tab}
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: '#2a2520', fontSize: '11px', letterSpacing: '2px', marginTop: '24px', position: 'relative', zIndex: 1 }}>
        ::build your presence::
      </p>

    </div>
  )
}