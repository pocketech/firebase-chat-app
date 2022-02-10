import { collection, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '@/libs/firebase'

import type { Chat } from '../types'

export const useChats = (userId: string | undefined) => {
  const [snapshot, isLoading, error] = useCollection(
    userId
      ? query(collection(db, 'chats'), where('memberIds', 'array-contains', userId))
      : undefined
  )
  const chats = snapshot
    ? (snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Chat[])
    : undefined

  return { chats, isLoading, error }
}
