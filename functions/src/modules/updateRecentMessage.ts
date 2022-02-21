import { region } from 'firebase-functions'

import { firestore } from 'firebase-admin'

export const updateRecentMessage = region('asia-northeast1')
  .firestore.document('chats/{chatId}/messages/{messageId}')
  .onCreate((snap, context) => {
    const newMessage = snap.data()

    if (newMessage.type === 'system') return

    const docRef = firestore().collection('chats').doc(context.params.chatId)

    return docRef.update({
      recentMessage: {
        body: newMessage.body || (newMessage.attachmentFileUrls && '画像が送信されました'),
        createdAt: newMessage.createdAt,
      },
      updatedAt: firestore.FieldValue.serverTimestamp(),
    })
  })
