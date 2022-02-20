import { deleteDoc, doc } from 'firebase/firestore'

import { db } from '@/libs/firebase'

export const deleteChat = async (chatId: string) => {
  await deleteDoc(doc(db, 'chats', chatId))
}
