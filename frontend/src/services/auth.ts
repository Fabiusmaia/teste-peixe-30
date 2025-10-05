import api from './api'
interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  access_token: string
}

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data)
  localStorage.setItem('token', response.data.access_token)
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
  window.location.reload()
}
