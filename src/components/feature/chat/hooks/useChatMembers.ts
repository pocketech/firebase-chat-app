import { collection, documentId, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { db } from '@/libs/firebase'
import type { User } from '@/types/user'
// @see https://qiita.com/xerroxcopy/items/c08bf7068c4b602b02d1
export const useChatMembers = (memberIds: string[] | undefined) => {
  const [snapshot, isLoading, error] = useCollection(
    memberIds ? query(collection(db, 'users'), where(documentId(), 'in', memberIds)) : undefined
  )

  const members = snapshot
    ? (snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as User[])
    : undefined

  return { members, isLoading, error }
}
