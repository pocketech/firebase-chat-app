import { doc, getDoc } from 'firebase/firestore'

import { db } from '@/libs/firebase'

export const checkIfChatExists = async (chatId: string) => {
  const ref = doc(db, 'chats', chatId)
  const docSnap = await getDoc(ref)

  return docSnap.exists()
}
