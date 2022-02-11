import { sha256 } from 'crypto-hash'
import type { FieldValue } from 'firebase/firestore'
import { getDoc } from 'firebase/firestore'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

import { db } from '@/libs/firebase'

import type { Chat } from '../types'

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

  const userIdsJoined = [...memberIds].sort().join('&')

  // メンバーの組み合わせによって一意なドキュメントIDを生成
  const chatId = await sha256(userIdsJoined)
  const ref = doc(db, 'chats', chatId)

  console.info({ userIdsJoined, chatId })
  const docSnap = await getDoc(ref)

  if (docSnap.exists()) throw new Error('このメンバーのチャットは既に存在しています')

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
