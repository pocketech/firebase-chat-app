import type { OptionalQuery as OptionalQuery0 } from '../pages/login'
import type { OptionalQuery as OptionalQuery1 } from '../pages/signup'
import type { OptionalQuery as OptionalQuery2 } from '../pages/signup/success'

export const pagesPath = {
  $404: {
    $url: (url?: { hash?: string }) => ({ pathname: '/404' as const, hash: url?.hash })
  },
  account: {
    delete: {
      $url: (url?: { hash?: string }) => ({ pathname: '/account/delete' as const, hash: url?.hash })
    },
    email_change: {
      $url: (url?: { hash?: string }) => ({ pathname: '/account/email-change' as const, hash: url?.hash })
    },
    password_change: {
      $url: (url?: { hash?: string }) => ({ pathname: '/account/password-change' as const, hash: url?.hash })
    },
    $url: (url?: { hash?: string }) => ({ pathname: '/account' as const, hash: url?.hash })
  },
  action: {
    $url: (url?: { hash?: string }) => ({ pathname: '/action' as const, hash: url?.hash })
  },
  chat: {
    _params: (params?: string[]) => ({
      $url: (url?: { hash?: string }) => ({ pathname: '/chat/[[...params]]' as const, query: { params }, hash: url?.hash })
    })
  },
  login: {
    $url: (url?: { query?: OptionalQuery0, hash?: string }) => ({ pathname: '/login' as const, query: url?.query, hash: url?.hash })
  },
  password_forgot: {
    $url: (url?: { hash?: string }) => ({ pathname: '/password-forgot' as const, hash: url?.hash })
  },
  profile: {
    $url: (url?: { hash?: string }) => ({ pathname: '/profile' as const, hash: url?.hash })
  },
  service: {
    _params: (params?: string[]) => ({
      $url: (url?: { hash?: string }) => ({ pathname: '/service/[[...params]]' as const, query: { params }, hash: url?.hash })
    })
  },
  signup: {
    confirm: {
      $url: (url?: { hash?: string }) => ({ pathname: '/signup/confirm' as const, hash: url?.hash })
    },
    success: {
      $url: (url?: { query?: OptionalQuery2, hash?: string }) => ({ pathname: '/signup/success' as const, query: url?.query, hash: url?.hash })
    },
    $url: (url?: { query?: OptionalQuery1, hash?: string }) => ({ pathname: '/signup' as const, query: url?.query, hash: url?.hash })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

export type PagesPath = typeof pagesPath
