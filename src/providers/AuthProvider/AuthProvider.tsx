import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { AuthContext, SignInCredentials, User } from '@/contexts'
import { paths } from '@/router'
import { api, setAuthorizationHeader } from '@/services'
import { createSessionCookies, getToken, removeSessionCookies } from '@/utils'

type Props = {
  children: ReactNode
}

function AuthProvider(props: Props) {
  const { children } = props

  const [user, setUser] = useState<User>()
  const [loadingUserData, setLoadingUserData] = useState(true)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const token = getToken()
  const isAuthenticated = Boolean(token)

  async function signIn(params: SignInCredentials) {
    const { email, password } = params

    try {
      const response = await api.post('/sessions', { email, password })
      const { token, refreshToken, permissions, roles } = response.data

      createSessionCookies({ token, refreshToken })
      setUser({ email, permissions, roles })
      setAuthorizationHeader({ request: api.defaults, token })
    } catch (error) {
      const err = error as AxiosError
      return err
    }
  }

  function signOut() {
    removeSessionCookies()
    setUser(undefined)
    setLoadingUserData(false)
    navigate(paths.LOGIN_PATH)
  }

  useEffect(() => {
    if (!token) {
      removeSessionCookies()
      setUser(undefined)
      setLoadingUserData(false)
    }
  }, [navigate, pathname, token])

  useEffect(() => {
    const token = getToken()

    async function getUserData() {
      setLoadingUserData(true)

      try {
        const response = await api.get('/me')

        if (response?.data) {
          const { email, permissions, roles } = response.data
          setUser({ email, permissions, roles })
        }
      } catch (error) {
        /**
         * an error handler can be added here
         */
      } finally {
        setLoadingUserData(false)
      }
    }

    if (token) {
      setAuthorizationHeader({ request: api.defaults, token })
      getUserData()
    }
  }, [])

  const authValue = useMemo(
    () => ({ user, isAuthenticated, loadingUserData, signIn, signOut }),
    [user, isAuthenticated, loadingUserData]
  );
  
  return (
    <AuthContext.Provider
      value={authValue}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
