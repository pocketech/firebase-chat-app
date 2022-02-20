import { region } from 'firebase-functions'

import { firestore } from 'firebase-admin'
import type { ExecuteOperation, GetQuery } from '../utils/executeBatch'
import { executeBatch } from '../utils/executeBatch'

export const deleteMessages = region('asia-northeast1')
  .firestore.document('chats/{chatId}')
  .onDelete(async (_snap, context) => {
    const getQuery: GetQuery<{ createdAt: string }> = ({ db, last }) => {
      let query = db
        .collection('chats')
        .doc(context.params.chatId)
        .collection('messages')
        .orderBy('createdAt', 'desc')

      if (last) query = query.startAfter(last.createdAt)

      return query
    }

    const executeOperation: ExecuteOperation = ({ batch, ref }) => {
      batch.delete(ref)
    }

    return await executeBatch({
      db: firestore(),
      batchSize: 500,
      executeOperation,
      getQuery,
    })
  })
