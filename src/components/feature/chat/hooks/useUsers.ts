import { collection } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '@/libs/firebase'
import type { User } from '@/types/user'

export const useUsers = () => {
  const [snapshot, isLoading, error] = useCollection(collection(db, 'users'))
  const users = snapshot
    ? (snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as User[])
    : undefined

  return { users, isLoading, error }
}
