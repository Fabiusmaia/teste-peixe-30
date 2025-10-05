import { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'

export const checkIsAuth = (cookies: RequestCookies) => {
  return cookies.get(`app.token`)
}
