import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Basic認証
export const middleware = (req: NextRequest) => {
  if (process.env.USE_BASIC_AUTH !== 'enabled') return

  const basicAuth = req.headers.get('authorization')

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1]
    const [user, password] = atob(auth).split(':')

    if (user === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }

  const authUrl = new URL('/api/auth', req.url)

  return NextResponse.rewrite(authUrl)
}
