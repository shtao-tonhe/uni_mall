export interface AdminInfo {
  id: string
  username: string
  nickname: string
  avatar: string
  role: string
}

export interface LoginResult {
  token: string
  admin: AdminInfo
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin_token')
}

export function getAdminInfo(): AdminInfo | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('admin_info')
  return raw ? JSON.parse(raw) : null
}

export function setAuth(data: LoginResult) {
  localStorage.setItem('admin_token', data.token)
  localStorage.setItem('admin_info', JSON.stringify(data.admin))
}

export function clearAuth() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_info')
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
