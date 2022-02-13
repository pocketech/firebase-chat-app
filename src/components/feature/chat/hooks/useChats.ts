import { collection, orderBy, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '@/libs/firebase'

import type { Chat } from '../types'

export const useChats = (userId: string | undefined) => {
  const [snapshot, isLoading, error] = useCollection(
    userId
      ? query(
          collection(db, 'chats'),
          where('memberIds', 'array-contains', userId),
          orderBy('updatedAt', 'desc')
        )
      : undefined
  )

  const chats = snapshot
    ? (snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
        updatedAt: doc.data({ serverTimestamps: 'estimate' }).updatedAt.toDate(),
        recentMessage: {
          body: doc.data().recentMessage?.body,
          createdAt: doc.data().recentMessage?.createdAt.toDate(),
        },
      })) as Chat[])
    : []

  return { chats, isLoading, error }
}
