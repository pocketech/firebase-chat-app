import type { FieldValue } from 'firebase/firestore'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'

import { db } from '@/libs/firebase'

import type { Message } from '../types'

export const updateMessage = async ({
  chatId,
  messageId,
  body,
}: {
  chatId: string
  messageId: string
  body: string
}) => {
  await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
    body,
    updatedAt: serverTimestamp(),
  } as Pick<Message, 'body'> & { updatedAt: FieldValue })
}
