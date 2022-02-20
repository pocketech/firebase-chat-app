import { region } from 'firebase-functions'

import { firestore } from 'firebase-admin'

import type { ExecuteOperation, GetQuery } from '../utils/executeBatch'
import { executeBatch } from '../utils/executeBatch'

export const deleteMessageAuthor = region('asia-northeast1')
  .firestore.document('chats/{chatId}')
  .onUpdate(async (change) => {
    const beforeMemberIds: string[] = change.before.data().memberIds
    const afterMemberIds: string[] = change.after.data().memberIds

    // メンバーの数が減ったとき(=誰かが退出したとき)のみ実行する
    if (beforeMemberIds.length <= afterMemberIds.length) return
    // 退出したメンバーのidを得る
    const leavedMemberId = beforeMemberIds.find((memberId) => !afterMemberIds.includes(memberId))

    if (!leavedMemberId) return

    const getQuery: GetQuery<{ createdAt: string }> = ({ db, last }) => {
      let query = db
        .collectionGroup('messages')
        .where('author.id', '==', leavedMemberId)
        .orderBy('createdAt', 'desc')

      if (last) query = query.startAfter(last.createdAt)

      return query
    }

    const executeOperation: ExecuteOperation = ({ batch, ref }) => {
      batch.update(ref, {
        author: firestore.FieldValue.delete(),
        updatedAt: firestore.FieldValue.serverTimestamp,
      })
    }

    return await executeBatch({ db: firestore(), batchSize: 500, executeOperation, getQuery })
  })
