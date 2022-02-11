import { collection, orderBy, query } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '@/libs/firebase'

import type { Message } from '../types'

export const useChatMessages = (chatId: string | undefined) => {
  const [snapshot, isLoading, error] = useCollection(
    chatId
      ? query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'desc'))
      : undefined
  )
  const messages = snapshot
    ? (snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
        updatedAt: doc.data({ serverTimestamps: 'estimate' }).updatedAt.toDate(),
      })) as Message[])
    : undefined

  return { messages, isLoading, error }
}
