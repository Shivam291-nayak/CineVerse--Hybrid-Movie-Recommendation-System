import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react'

import api from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (token && storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveSession = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    })

    saveSession(data)
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    })

    saveSession(data)
    return data
  }

  const setAuthenticatedUser = (authenticatedUser) => {
    setUser(authenticatedUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        setAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
