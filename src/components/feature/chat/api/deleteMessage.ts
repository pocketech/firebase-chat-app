import { deleteDoc, doc } from 'firebase/firestore'

import { db } from '@/libs/firebase'

export const deleteMessage = async ({
  chatId,
  messageId,
}: {
  chatId: string
  messageId: string
}) => {
  await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId))
}
