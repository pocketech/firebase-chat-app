import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

import { pagesPath } from '@/libs/$path'

import { userContext } from '../context/AuthContextProvider'

/**
 * ログインしているユーザーの, 認証情報を扱うカスタムフック。
 */
export const useAuthUser = () => {
  const value = useContext(userContext)

  if (!value) throw new Error('useAuthUser must be inside a Provider with a value')

  return value
}

/**
 * 未ログインの場合、path パラメータを付与して /login にリダイレクトするカスタムフック
 */
export const useRequireLogin = () => {
  const { error } = useAuthUser()
  // FIXME: pathname を内部で取得するのではなく、引数で受け取ったほうがクリーンかも
  const { push, asPath, isReady } = useRouter()

  console.info('Require login:', { asPath, error })

  useEffect(() => {
    if (error && isReady) push(pagesPath.login.$url({ query: { path: asPath } }))
  }, [error, isReady])
}
