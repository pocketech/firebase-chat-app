import { collection, orderBy, query, startAfter } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '@/libs/firebase'

import type { Message } from '../types'

export const useNewerChatMessages = ({
  chatId,
  after,
}: {
  chatId: string | undefined
  after: Date | undefined
}) => {
  const [snapshot, isLoading, error] = useCollection(
    chatId && after
      ? query(
          collection(db, 'chats', chatId, 'messages'),
          orderBy('createdAt', 'asc'),
          startAfter(after)
        )
      : undefined
  )

  const messages = snapshot
    ? (snapshot.docs.map((doc) => {
        const data = doc.data({ serverTimestamps: 'estimate' })

        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        }
      }) as Message[])
    : []

  return { messages, isLoading, error }
}
