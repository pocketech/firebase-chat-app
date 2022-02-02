/* eslint-disable */
// prettier-ignore
import { OptionalQuery as OptionalQuery0 } from '../pages/login'

// prettier-ignore
export const pagesPath = {
  $404: {
    $url: (url?: { hash?: string }) => ({ pathname: '/404' as const, hash: url?.hash })
  },
  action: {
    $url: (url?: { hash?: string }) => ({ pathname: '/action' as const, hash: url?.hash })
  },
  login: {
    $url: (url?: { query?: OptionalQuery0, hash?: string }) => ({ pathname: '/login' as const, query: url?.query, hash: url?.hash })
  },
  password_forgot: {
    $url: (url?: { hash?: string }) => ({ pathname: '/password-forgot' as const, hash: url?.hash })
  },
  signup: {
    confirm: {
      $url: (url?: { hash?: string }) => ({ pathname: '/signup/confirm' as const, hash: url?.hash })
    },
    profile: {
      $url: (url?: { hash?: string }) => ({ pathname: '/signup/profile' as const, hash: url?.hash })
    },
    $url: (url?: { hash?: string }) => ({ pathname: '/signup' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

// prettier-ignore
export type PagesPath = typeof pagesPath
