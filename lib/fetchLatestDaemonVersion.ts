import { DAEMON_VERSION_URL } from './constants/DAEMON_VERSION_URL'

export async function fetchLatestDaemonVersion(): Promise<string | null> {
  try {
    const response = await fetch(DAEMON_VERSION_URL, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    if (!response.ok) return null
    const text = await response.text()
    const matched = /"tag_name"\s*:\s*"(?<tag>[^"]+)"/.exec(text)
    if (!matched || !matched.groups) return null
    const { tag } = matched.groups
    if (typeof tag !== 'string' || tag === '') return null
    return tag.replace(/^v/, '')
  } catch {
    return null
  }
}
