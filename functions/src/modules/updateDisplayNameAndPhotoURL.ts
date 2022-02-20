import { region } from 'firebase-functions'

import { auth } from 'firebase-admin'

export const updateDisplayNameAndPhotoURL = region('asia-northeast1')
  .firestore.document('users/{userId}')
  .onUpdate((change, context) => {
    const newName = change.after.data().name
    const newAvatarUrl = change.after.data().avatarUrl

    console.info(newName)

    return auth().updateUser(context.params.userId, {
      displayName: newName,
      photoURL: newAvatarUrl,
    })
  })
