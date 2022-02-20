import { region } from 'firebase-functions'

import { firestore } from 'firebase-admin'

export const deleteUserDocument = region('asia-northeast1')
  .auth.user()
  .onDelete(async (user) => {
    const userUid = user.uid

    return firestore().collection('users').doc(userUid).delete()
  })
