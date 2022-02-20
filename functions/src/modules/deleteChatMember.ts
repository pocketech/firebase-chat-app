import { region } from 'firebase-functions'

import { firestore } from 'firebase-admin'

import type { ExecuteOperation, GetQuery } from '../utils/executeBatch'
import { executeBatch } from '../utils/executeBatch'

export const deleteChatMember = region('asia-northeast1')
  .firestore.document('users/{userId}')
  .onDelete(async (_snap, context) => {
    const targetUserId = context.params.userId
    const getQuery: GetQuery<{ createdAt: string }> = ({ db, last }) => {
      let query = db
        .collection('chats')
        .where('memberIds', 'array-contains', targetUserId)
        .orderBy('createdAt', 'desc')

      if (last) query = query.startAfter(last.createdAt)

      return query
    }

    const executeOperation: ExecuteOperation = ({ batch, ref }) => {
      batch.update(ref, {
        memberIds: firestore.FieldValue.arrayRemove(targetUserId),
        updatedAt: firestore.FieldValue.serverTimestamp,
      })
    }

    return await executeBatch({ db: firestore(), batchSize: 500, executeOperation, getQuery })
  })
