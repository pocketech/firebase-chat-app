import { region } from 'firebase-functions'

import { auth, firestore } from 'firebase-admin'

export const createUserDocument = region('asia-northeast1')
  .auth.user()
  .onCreate(async (user) => {
    const userUid = user.uid

    console.info(user.displayName) // → nullになってしまう

    // admin.auth().getUser() 経由で取得, 取得するまでawait
    const authedUser = await auth().getUser(userUid)
    const name = authedUser.displayName
    const avatarUrl = authedUser.photoURL

    const newUser = {
      name,
      avatarUrl,
    }

    console.info({ newUser })

    const result = await firestore().collection('users').doc(userUid).set({
      name,
      avatarUrl,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    })

    console.info({ result })

    return result
  })
