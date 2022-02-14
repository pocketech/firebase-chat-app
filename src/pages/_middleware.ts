import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Basic認証
export const middleware = (req: NextRequest) => {
  if (!process.env.USE_BASIC_AUTH) return

  const basicAuth = req.headers.get('authorization')

  if (basicAuth) {
    const auth = basicAuth.split(' ')[1]
    const [user, password] = Buffer.from(auth, 'base64').toString().split(':')

    if (user === process.env.BASIC_AUTH_USER && password === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new Response('Auth required', {
    status: 401,
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}
