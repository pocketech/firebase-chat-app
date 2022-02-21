import type { FieldValue } from 'firebase/firestore'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

import { db } from '@/libs/firebase'

import type { Chat } from '../types'
import { generateChatId } from '../utils/generateChatId'
import { checkIfChatExists } from './checkIfChatExists'

type Params = {
  createdBy: string
  name?: string
  /**
   * createdByを含まない
   */
  selectedUserIds: string[]
}

export const createChat = async (params: Params) => {
  const memberIds = [...params.selectedUserIds, params.createdBy]
  const chatId = await generateChatId(memberIds)
  const isDuplicated = await checkIfChatExists(chatId)

  if (isDuplicated) throw new Error('このメンバーのチャットは既に存在しています')
  const ref = doc(db, 'chats', chatId)

  // TODO: 型付けの最適化
  await setDoc(ref, {
    name: params.name,
    createdBy: params.createdBy,
    memberIds,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as Pick<Chat, 'memberIds' | 'name' | 'createdBy'> & { createdAt: FieldValue; updatedAt: FieldValue })

  return chatId
}
