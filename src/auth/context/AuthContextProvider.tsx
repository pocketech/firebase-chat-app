import type { User } from 'firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import type { FC } from 'react'
import { createContext } from 'react'
import { useEffect } from 'react'
import { useLoadingValue } from 'react-firebase-hooks/util'

import { auth } from '@/libs/firebase'

export const userContext = createContext<
  | {
      authenticatedUser: User | null | undefined
      isLoading: boolean
      error?: Error
    }
  | undefined
>(undefined)

// eslint-disable-next-line react/display-name
export const AuthContextProvider: FC = ({ children }) => {
  const {
    error,
    loading: isLoading,
    setError,
    setValue,
    value,
  } = useLoadingValue<User | null, Error>(() => auth.currentUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => setValue(user),
      (error) => setError(error)
    )

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <userContext.Provider value={{ authenticatedUser: value, error, isLoading }}>
      {children}
    </userContext.Provider>
  )
}
