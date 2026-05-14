import {
  FaInstagram, FaLinkedin, FaGithub, FaTwitter,
  FaYoutube, FaTiktok, FaFacebook, FaSnapchat,
  FaTwitch, FaSpotify, FaWhatsapp, FaTelegram,
  FaGlobe, FaLink
} from 'react-icons/fa'

const getIcon = (platform) => {
  const p = platform?.toLowerCase()
  const style = { fontSize: '20px' }

  switch (p) {
    case 'instagram': return <FaInstagram style={style} />
    case 'linkedin': return <FaLinkedin style={style} />
    case 'github': return <FaGithub style={style} />
    case 'twitter': return <FaTwitter style={style} />
    case 'x': return <FaTwitter style={style} />
    case 'youtube': return <FaYoutube style={style} />
    case 'tiktok': return <FaTiktok style={style} />
    case 'facebook': return <FaFacebook style={style} />
    case 'snapchat': return <FaSnapchat style={style} />
    case 'twitch': return <FaTwitch style={style} />
    case 'spotify': return <FaSpotify style={style} />
    case 'whatsapp': return <FaWhatsapp style={style} />
    case 'telegram': return <FaTelegram style={style} />
    case 'website': return <FaGlobe style={style} />
    default: return <FaLink style={style} />
  }
}

export default getIcon