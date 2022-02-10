import { doc } from 'firebase/firestore'
import { useMemo } from 'react'
import { useDocumentOnce } from 'react-firebase-hooks/firestore'

import { db } from '@/libs/firebase'
import type { User } from '@/types/user'

export const useUserOnce = (userId: string | undefined) => {
  const [snapshot, isLoading, error, reload] = useDocumentOnce(
    userId ? doc(db, 'users', userId) : undefined
  )
  const user = useMemo(
    () => (snapshot ? ({ ...snapshot.data(), id: snapshot.id } as User) : undefined),
    [snapshot]
  )

  return { user, isLoading, error, reload }
}
