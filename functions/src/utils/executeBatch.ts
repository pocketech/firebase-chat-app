import type * as admin from "firebase-admin"


export type GetQuery<ItemType> = (params: {db: admin.firestore.Firestore; last? : ItemType}) => admin.firestore.Query

export type ExecuteOperation = (params : {batch: admin.firestore.WriteBatch; ref: admin.firestore.DocumentReference}) => void

type Params<T> = {
  db: admin.firestore.Firestore
  batchSize: number
  getQuery: GetQuery<T>
  executeOperation: ExecuteOperation
  last?: T
}

export const executeBatch = async<T>({db, batchSize, getQuery, executeOperation, last}: Params<T> ): Promise<void>=> {

  const query = getQuery({db, last})
  const items = await query.limit(batchSize).get()

  if (items.size === 0) return

  const batch = db.batch()
  
  items.docs.forEach(item => executeOperation({batch, ref: item.ref}))
  await batch.commit()

  const lastItem = items.docs[items.size - 1].data() as any

  return await executeBatch({db, batchSize, getQuery, executeOperation, last: lastItem})

}
