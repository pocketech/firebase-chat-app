import * as functions from "firebase-functions"

import * as admin from "firebase-admin"

import type { ExecuteOperation, GetQuery} from "../utils/executeBatch";
import {executeBatch } from "../utils/executeBatch"

exports.updateMessageAuthor = functions.region('asia-northeast1').firestore.document('users/{userId}').onUpdate(async (change, context) => {
  const newName = change.after.data().name
  const newAvatarUrl: string | undefined = change.after.data().avatarUrl

  // 最新のメッセージから500件取得
  const getQuery: GetQuery<{createdAt: string}> = ({db, last}) =>{
  let query = db.collectionGroup("messages").where('author.id', '==', context.params.userId).orderBy('createdAt', 'desc')

  if (last) query = query.startAfter(last.createdAt)

  return query
}

const executeOperation: ExecuteOperation= ({batch, ref}) => {
  batch.update(ref, {
    "author.name": newName,
    "author.avatarUrl": newAvatarUrl || admin.firestore.FieldValue.delete()
  })
}

return await executeBatch({db: admin.firestore(), batchSize: 500, executeOperation, getQuery, })
 

});