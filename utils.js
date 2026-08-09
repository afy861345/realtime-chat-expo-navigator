import ProfileImage from "./assets/avatar.jpg"
function log(...args) {
  for (let arg of args) {
    if (typeof arg === 'object' && arg !== null) {
      console.log(JSON.stringify(arg, null, 2));
    } else {
      console.log(arg);
    }
  }
}
function thumbnail(url) {
  if (!url) {
    return ProfileImage
  }
  return {
    uri: process.env.EXPO_PUBLIC_API_URL.slice(0, -1) + url
  }
}

function formatedTime(date) {
  if (date === null) {
    return "-"
  }
  const now = new Date()
  const s = Math.abs(now - new Date(date)) / 1000
  if (s < 60) {
    return 'now'
  }
  if (s < 60 * 60) {
    const m = Math.floor(s / 60)
    return `${m} minutes ago`
  }
  if (s < 60 * 60 * 24) {
    const h = Math.floor(s / (60 * 60))
    return `${h} hours ago`
  }

  if (s < 60 * 60 * 24 * 7) {
    const d = Math.floor(s / (60 * 60 * 24))
    return `${d} days ago`
  }
  if (s < 60 * 60 * 24 * 7 * 4) {
    const w = Math.floor(s / (60 * 60 * 24 * 7))
    return `${w} weeks ago`
  }

  const y = Math.floor(s / (60 * 60 * 24 * 365))
  return `${y} years ago`
}
export default { log, thumbnail, formatedTime };

