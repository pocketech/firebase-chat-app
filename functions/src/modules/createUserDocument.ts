import { region } from 'firebase-functions'

import { auth, firestore } from 'firebase-admin'

export const createUserDocument = region('asia-northeast1')
  .auth.user()
  .onCreate(async (user) => {
    const userUid = user.uid

    console.info(user.displayName)

    // admin.auth().getUser() 経由で取得, 取得するまでawait
    const authedUser = await auth().getUser(userUid)
    const name = authedUser.displayName
    const avatarUrl = authedUser.photoURL

    const newUser = {
      name,
      avatarUrl,
    }

    firestore().settings({
      ignoreUndefinedProperties: true,
    })

    return firestore().collection('users').doc(userUid).set(newUser)
  })
