import { destroyCookie, parseCookies, setCookie } from 'nookies'
import {
  COOKIE_EXPIRATION_TIME,
  REFRESH_TOKEN_COOKIE,
  TOKEN_COOKIE
} from '@/utils'

type CreateSessionCookiesParams = {
  token?: string
  refreshToken?: string
}

export function createSessionCookies(params: CreateSessionCookiesParams) {
  const { token, refreshToken } = params

  if (token) {
    // setCookie(null, TOKEN_COOKIE, token, {
    //   maxAge: COOKIE_EXPIRATION_TIME,
    //   path: '/'
    // })
    localStorage.setItem("token", token);
  }

  if (refreshToken) {
    setCookie(null, REFRESH_TOKEN_COOKIE, refreshToken, {
      maxAge: COOKIE_EXPIRATION_TIME,
      path: '/'
    })
  }
}

export function removeSessionCookies() {
  // destroyCookie(null, TOKEN_COOKIE)
  // destroyCookie(null, REFRESH_TOKEN_COOKIE)
  localStorage.deleteItem("token");
}

export function getToken() {
  // const cookies = parseCookies()
  // return cookies[TOKEN_COOKIE]

  return localStorage.getItem("token");
}

export function getRefreshToken() {
  const cookies = parseCookies()
  return cookies[REFRESH_TOKEN_COOKIE]
}
