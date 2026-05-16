import {
  FaInstagram, FaLinkedin, FaGithub, FaTwitter,
  FaYoutube, FaTiktok, FaFacebook, FaSnapchat,
  FaTwitch, FaSpotify, FaWhatsapp, FaTelegram,
  FaGlobe, FaLink
} from 'react-icons/fa'

const getIcon = (platform) => {
  const p = platform?.toLowerCase().trim()
  const style = { fontSize: '20px' }

  switch (p) {
    case 'instagram':
    case 'Instagram':
    case 'insta':
    case 'ig':
      return <FaInstagram style={style} />

    case 'linkedin':
    case 'Linkedin':
    case 'LinkedIn':
    case 'Linked In':
    case 'linked in':
    case 'linkedIn':
      return <FaLinkedin style={style} />

    case 'github':
    case 'Github':
    case 'GitHub':
    case 'git':
      return <FaGithub style={style} />

    case 'twitter':
    case 'Twitter':
    case 'x':
    case 'X':
    case 'tweet':
      return <FaTwitter style={style} />

    case 'youtube':
    case 'Youtube':
    case 'YouTube':
    case 'yt':
      return <FaYoutube style={style} />

    case 'tiktok':
    case 'Tiktok':
    case 'TikTok':
    case 'tik tok':
    case 'Tik Tok':
      return <FaTiktok style={style} />

    case 'facebook':
    case 'Facebook':
    case 'fb':
    case 'FB':
      return <FaFacebook style={style} />

    case 'snapchat':
    case 'Snapchat':
    case 'snap':
    case 'Snap':
      return <FaSnapchat style={style} />

    case 'twitch':
    case 'Twitch':
      return <FaTwitch style={style} />

    case 'spotify':
    case 'Spotify':
      return <FaSpotify style={style} />

    case 'whatsapp':
    case 'Whatsapp':
    case 'WhatsApp':
    case 'wa':
    case 'WA':
      return <FaWhatsapp style={style} />

    case 'telegram':
    case 'Telegram':
    case 'tg':
    case 'TG':
      return <FaTelegram style={style} />

    case 'website':
    case 'Website':
    case 'web':
    case 'Web':
    case 'link':
      return <FaGlobe style={style} />

    default:
      return <FaLink style={style} />
  }
}

export default getIcon