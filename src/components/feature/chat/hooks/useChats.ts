import { collection, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '@/libs/firebase'

import type { Chat } from '../types'

export const useChats = (userId: string | undefined) => {
  const [snapshot, isLoading, error] = useCollection(
    userId
      ? query(
          collection(db, 'chats'),
          where('memberIds', 'array-contains', userId)
          // orderBy('recentMessage.createdAt', 'desc')
        )
      : undefined
  )

  const chats = snapshot
    ? (
        snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
          updatedAt: doc.data({ serverTimestamps: 'estimate' }).updatedAt.toDate(),
          recentMessage: {
            body: doc.data().recentMessage?.body,
            createdAt: doc.data().recentMessage?.createdAt.toDate(),
          },
        })) as Chat[]
      ).sort((a, b) =>
        (a.recentMessage?.createdAt ?? a.updatedAt) > (b.recentMessage?.createdAt ?? b.updatedAt)
          ? -1
          : 1
      ) // 最新の更新順で並び替え
    : []

  return { chats, isLoading, error }
}
