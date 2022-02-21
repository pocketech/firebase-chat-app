import { region } from 'firebase-functions'

import { storage } from 'firebase-admin'

export const deleteUserImages = region('asia-northeast1')
  .firestore.document('users/{userId}')
  .onDelete(async (_snap, context) => {
    const targetUserId = context.params.userId

    return storage()
      .bucket()
      .deleteFiles({
        prefix: `users/${targetUserId}`,
      })
  })
