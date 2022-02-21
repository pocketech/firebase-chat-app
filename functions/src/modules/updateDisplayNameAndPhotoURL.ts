import { region } from 'firebase-functions'

import { auth } from 'firebase-admin'

export const updateDisplayNameAndPhotoURL = region('asia-northeast1')
  .firestore.document('users/{userId}')
  .onUpdate((change, context) => {
    if (!change.after.exists) return

    const newName: string = change.after.data().name
    const newAvatarUrl: string = change.after.data().avatarUrl

    console.info({
      newName,
      newAvatarUrl,
    })

    // const authedUser = await auth().getUser(context.params.userId)

    // if (authedUser.providerData[0].providerId as ProviderId !== 'password') return

    return auth().updateUser(context.params.userId, {
      displayName: newName,
      photoURL: newAvatarUrl,
    })
  })
