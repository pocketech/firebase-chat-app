import type { FieldValue } from 'firebase/firestore'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

import { db } from '@/libs/firebase'

import type { Message } from '../types'

type Params = Pick<Message, 'author' | 'body' | 'attachmentFileUrls'> & { chatId: string }

export const createMessage = async (params: Params) => {
  const ref = collection(db, 'chats', params.chatId, 'messages')

  // TODO: 型付けの最適化
  return await addDoc(ref, {
    ...params,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as Params & { createdAt: FieldValue; updatedAt: FieldValue })
}
