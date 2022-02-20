import { region } from 'firebase-functions'

import { firestore } from 'firebase-admin'

import type { ExecuteOperation, GetQuery } from '../utils/executeBatch'
import { executeBatch } from '../utils/executeBatch'

export const updateMessageAuthor = region('asia-northeast1')
  .firestore.document('users/{userId}')
  .onUpdate(async (change, context) => {
    const newName = change.after.data().name
    const newAvatarUrl: string | undefined = change.after.data().avatarUrl
    const newSelfIntroduction: string | undefined = change.after.data().selfIntroduction

    // 対象ユーザが作成したメッセージを最新のものから抽出するクエリビルダー
    const getQuery: GetQuery<{ createdAt: string }> = ({ db, last }) => {
      let query = db
        .collectionGroup('messages')
        .where('author.id', '==', context.params.userId)
        .orderBy('createdAt', 'desc')

      if (last) query = query.startAfter(last.createdAt)

      return query
    }

    const executeOperation: ExecuteOperation = ({ batch, ref }) => {
      batch.update(ref, {
        'author.name': newName,
        'author.avatarUrl': newAvatarUrl || firestore.FieldValue.delete(),
        'author.selfIntroduction': newSelfIntroduction || firestore.FieldValue.delete(),
      })
    }

    return await executeBatch({ db: firestore(), batchSize: 500, executeOperation, getQuery })
  })
