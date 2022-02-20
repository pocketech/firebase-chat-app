import type { FieldValue } from 'firebase/firestore'
import { arrayRemove, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'

import { db } from '@/libs/firebase'

import type { Chat } from '../types'

export const updateChatName = async ({ chatId, name }: { chatId: string; name: string }) => {
  await updateDoc(doc(db, 'chats', chatId), {
    name,
    updatedAt: serverTimestamp(),
  } as Pick<Chat, 'name'> & { updatedAt: FieldValue })
}

export const updateChatMembers = async ({
  chatId,
  additionalUserIds,
}: {
  chatId: string
  additionalUserIds: string[]
}) => {
  await updateDoc(doc(db, 'chats', chatId), {
    memberIds: arrayUnion(...additionalUserIds),
    updatedAt: serverTimestamp(),
  } as { updatedAt: FieldValue; memberIds: FieldValue })
}

export const leaveChat = async ({ chatId, userId }: { chatId: string; userId: string }) => {
  await updateDoc(doc(db, 'chats', chatId), {
    memberIds: arrayRemove(userId),
    updatedAt: serverTimestamp(),
  } as { updatedAt: FieldValue; memberIds: FieldValue })
}
