import themes from '../themes'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { token, username, logout } = useAuth()
  const navigate = useNavigate()

  const [photo, setPhoto] = useState('')
  const [photoLoading, setPhotoLoading] = useState(false)
  const [profile, setProfile] = useState({ bio: '', photo: '', theme: 'default' })
  const [bio, setBio] = useState('')
  const [profileMsg, setProfileMsg] = useState('')
  const [links, setLinks] = useState([])
  const [newLink, setNewLink] = useState({ title: '', url: '', icon: '' })
  const [editingLink, setEditingLink] = useState(null)
  const [linkMsg, setLinkMsg] = useState('')

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
    setProfileMsg('Photo updated!')
    setTimeout(() => setProfileMsg(''), 3000)
  } catch (err) {
    console.log(err)
  }
  setPhotoLoading(false)
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
      await axios.put(`${API}/profile/update`, { bio }, { headers })
      setProfileMsg('Profile updated!')
      setTimeout(() => setProfileMsg(''), 3000)
    } catch (err) {
      console.log(err)
    }
  }

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) return
    try {
      const res = await axios.post(`${API}/links`, newLink, { headers })
      setLinks([...links, res.data])
      setNewLink({ title: '', url: '', icon: '' })
      setLinkMsg('Link added!')
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
      setLinkMsg('Link updated!')
      setTimeout(() => setLinkMsg(''), 3000)
    } catch (err) {
      console.log(err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0eaff',
    caretColor: '#c9b8ff'
  }

  const cardStyle = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)'
  }

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
        <div className="flex gap-3 items-center">
          <span className="text-sm" style={{ color: '#9b8ec4' }}>@{username}</span>
          <button onClick={() => navigate('/analytics')}
            className="text-sm px-4 py-2 rounded-xl transition"
            style={{ background: 'rgba(201,184,255,0.1)', color: '#c9b8ff', border: '1px solid rgba(201,184,255,0.2)' }}>
            Analytics
          </button>
          <button onClick={() => navigate(`/${username}`)}
            className="text-sm px-4 py-2 rounded-xl transition"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#9b8ec4', border: '1px solid rgba(255,255,255,0.08)' }}>
            View Profile
          </button>
          <button onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-xl transition"
            style={{ background: 'rgba(255,180,180,0.08)', color: '#ffaaaa', border: '1px solid rgba(255,180,180,0.15)' }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6 space-y-6 relative z-10">
{/*Sharea Link */}
<div className="rounded-3xl p-6" style={cardStyle}>
  <h2 className="text-lg font-bold mb-2" style={{ color: '#f0eaff' }}>
    Your Shareable Link
  </h2>
  <p className="text-sm mb-4" style={{ color: '#9b8ec4' }}>
    Share this link on Instagram, Twitter, TikTok bio etc.
  </p>

  <div className="flex items-center gap-2 rounded-2xl p-3"
    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,184,255,0.2)' }}>
    <span className="flex-1 text-sm truncate" style={{ color: '#c9b8ff' }}>
      https://linktreeclone-black.vercel.app/{username}
    </span>
    <button
      onClick={() => {
        navigator.clipboard.writeText(`https://linktreeclone-black.vercel.app/${username}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition"
      style={{
        background: 'linear-gradient(135deg, #c9b8ff, #ffb8d9)',
        color: '#1a1a2e'
      }}>
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  </div>
</div>


{/* Profile Section */}
      
<div className="rounded-3xl p-6" style={cardStyle}>
  <h2 className="text-lg font-bold mb-4" style={{ color: '#f0eaff' }}>Profile</h2>

  <p className="text-sm mb-4" style={{ color: '#9b8ec4' }}>
    Username: <span style={{ color: '#c9b8ff' }}>@{username}</span>
  </p>

  {/* Photo Upload */}
  <div className="flex items-center gap-4 mb-4">
    {/* Avatar preview */}
    <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
      style={{
        background: 'linear-gradient(135deg, #c9b8ff, #ffb8d9)',
        boxShadow: '0 4px 20px rgba(201,184,255,0.3)'
      }}>
      {photo ? (
        <img src={photo} alt="profile"
          className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl font-bold" style={{ color: '#1a1a2e' }}>
          {username?.[0]?.toUpperCase()}
        </span>
      )}
    </div>

    {/* Upload button */}
    <div>
      <label htmlFor="photo-upload"
        className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition block text-center"
        style={{
          background: 'rgba(201,184,255,0.1)',
          border: '1px solid rgba(201,184,255,0.2)',
          color: '#c9b8ff'
        }}>
        {photoLoading ? 'Uploading...' : 'Upload Photo'}
      </label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <p className="text-xs mt-1" style={{ color: '#4a4268' }}>
        JPG, PNG or WEBP
      </p>
    </div>
  </div>

  {/* Bio */}
  <textarea
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    placeholder="Write your bio..."
    rows={3}
    className="w-full rounded-xl px-4 py-3 text-sm outline-none transition resize-none"
    style={inputStyle}
    onFocus={e => e.target.style.borderColor = '#c9b8ff'}
    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
  />

  <button onClick={handleProfileUpdate}
    className="mt-3 px-6 py-2 rounded-xl text-sm font-semibold transition"
    style={{
      background: 'linear-gradient(135deg, #c9b8ff, #ffb8d9)',
      color: '#1a1a2e',
      boxShadow: '0 4px 20px rgba(201,184,255,0.2)'
    }}>
    Save Profile
  </button>

  {profileMsg && (
    <p className="text-sm mt-2" style={{ color: '#b8ffd9' }}>{profileMsg}</p>
  )}
</div>
        {/* Theme Picker */}
<div className="rounded-3xl p-6" style={cardStyle}>
  <h2 className="text-lg font-bold mb-4" style={{ color: '#f0eaff' }}>
    Choose Theme
  </h2>
  <div className="grid grid-cols-3 gap-3">
    {Object.entries(themes).map(([key, theme]) => (
      <button
        key={key}
        onClick={async () => {
          try {
            await axios.put(`${API}/profile/update`,
              { bio, theme: key }, { headers })
            setProfile({ ...profile, theme: key })
          } catch (err) {
            console.log(err)
          }
        }}
        className="rounded-2xl p-3 flex flex-col items-center gap-2 transition"
        style={{
          background: theme.card,
          border: `2px solid ${profile.theme === key ? theme.accent : 'rgba(255,255,255,0.08)'}`,
          boxShadow: profile.theme === key ? `0 4px 20px ${theme.glow1}40` : 'none'
        }}
      >
        {/* Mini preview */}
        <div className="w-full h-8 rounded-xl"
          style={{ background: theme.button }} />
        <span className="text-xs font-medium" style={{ color: '#f0eaff' }}>
          {theme.name}
        </span>
      </button>
    ))}
  </div>
  {profileMsg && (
    <p className="text-sm mt-3" style={{ color: '#b8ffd9' }}>{profileMsg}</p>
  )}
</div>

        {/* Add Link Section */}
        <div className="rounded-3xl p-6" style={cardStyle}>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#f0eaff' }}>Add New Link</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title (e.g. My Instagram)"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#c9b8ff'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <input
              type="url"
              placeholder="URL (e.g. https://instagram.com/yourname)"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#c9b8ff'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <input
              type="text"
              placeholder="Platform (e.g. instagram, linkedin, github)"
              value={newLink.icon}
              onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#c9b8ff'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <button onClick={handleAddLink}
              className="w-full py-3 rounded-xl font-semibold text-sm transition"
              style={{
                background: 'linear-gradient(135deg, #c9b8ff, #ffb8d9)',
                color: '#1a1a2e',
                boxShadow: '0 4px 20px rgba(201,184,255,0.2)'
              }}>
              + Add Link
            </button>
          </div>
          {linkMsg && <p className="text-sm mt-2" style={{ color: '#b8ffd9' }}>{linkMsg}</p>}
        </div>

        {/* Links List */}
        <div className="rounded-3xl p-6" style={cardStyle}>
          <h2 className="text-lg font-bold mb-4" style={{ color: '#f0eaff' }}>
            Your Links <span style={{ color: '#9b8ec4', fontWeight: 400, fontSize: '14px' }}>({links.length})</span>
          </h2>

          {links.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: '#4a4268' }}>
              No links yet. Add your first link above!
            </p>
          )}

          <div className="space-y-3">
            {links.map(link => (
              <div key={link._id}
                className="rounded-2xl p-4 flex items-center justify-between gap-3 transition"
                style={{
                  background: link.isActive ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${link.isActive ? 'rgba(201,184,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
                  opacity: link.isActive ? 1 : 0.5
                }}>

                {editingLink?._id === link._id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      value={editingLink.title}
                      onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                      className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                      style={inputStyle}
                    />
                    <input
                      value={editingLink.url}
                      onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                      className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                      style={inputStyle}
                    />
                    <div className="flex gap-2">
                      <button onClick={handleEditLink}
                        className="text-xs px-4 py-1.5 rounded-lg font-medium"
                        style={{ background: 'linear-gradient(135deg, #c9b8ff, #ffb8d9)', color: '#1a1a2e' }}>
                        Save
                      </button>
                      <button onClick={() => setEditingLink(null)}
                        className="text-xs px-4 py-1.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#9b8ec4' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: '#f0eaff' }}>{link.title}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#4a4268' }}>{link.url}</p>
                      <p className="text-xs mt-1" style={{ color: '#c9b8ff' }}>{link.clicks} clicks</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => handleToggle(link)}
                        className="text-xs px-3 py-1.5 rounded-lg transition"
                        style={{
                          background: link.isActive ? 'rgba(184,255,217,0.1)' : 'rgba(255,255,255,0.05)',
                          color: link.isActive ? '#b8ffd9' : '#4a4268',
                          border: `1px solid ${link.isActive ? 'rgba(184,255,217,0.2)' : 'rgba(255,255,255,0.05)'}`
                        }}>
                        {link.isActive ? 'On' : 'Off'}
                      </button>
                      <button onClick={() => setEditingLink(link)}
                        className="text-xs px-3 py-1.5 rounded-lg transition"
                        style={{
                          background: 'rgba(184,217,255,0.1)',
                          color: '#b8d9ff',
                          border: '1px solid rgba(184,217,255,0.2)'
                        }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteLink(link._id)}
                        className="text-xs px-3 py-1.5 rounded-lg transition"
                        style={{
                          background: 'rgba(255,180,180,0.08)',
                          color: '#ffaaaa',
                          border: '1px solid rgba(255,180,180,0.15)'
                        }}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}