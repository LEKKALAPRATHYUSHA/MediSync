import { createContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })

  const login = (userData, token) => {
    // Store token inside user object AND separately for axiosInstance
    const userWithToken = { ...userData, token }
    localStorage.setItem('user', JSON.stringify(userWithToken))
    setUser(userWithToken)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const hasRole = (role) => user?.role === role

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        hasRole,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext