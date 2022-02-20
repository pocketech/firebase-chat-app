import type { FieldValue } from 'firebase/firestore'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

import { db } from '@/libs/firebase'

import type { UserMessage } from '../types'

type Params = Pick<UserMessage, 'author' | 'body' | 'attachmentFileUrls'> & { chatId: string }

export const createMessage = async (params: Params) => {
  const ref = collection(db, 'chats', params.chatId, 'messages')

  // TODO: 型付けの最適化
  return await addDoc(ref, {
    author: params.author,
    body: params.body,
    attachmentFileUrls: params.attachmentFileUrls,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    type: 'user',
  } as Pick<UserMessage, 'author' | 'body' | 'attachmentFileUrls' | 'type'> & { createdAt: FieldValue; updatedAt: FieldValue })
}
