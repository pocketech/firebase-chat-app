import { region } from 'firebase-functions'

import { firestore } from 'firebase-admin'

export const createFirstMessage = region('asia-northeast1')
  .firestore.document('chats/{chatId}')
  .onCreate(async (snap, context) => {
    const newChatMemberIds: string[] = snap.data().memberIds

    const members = await firestore()
      .collection('users')
      .where(firestore.FieldPath.documentId(), 'in', newChatMemberIds)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name as string,
        }))
      )

    const message = `${members.map((member) => member.name).join(', ')} がチャットに参加しました`

    const colRef = firestore().collection('chats').doc(context.params.chatId).collection('messages')

    return colRef.add({
      createdAt: firestore.FieldValue.serverTimestamp,
      updatedAt: firestore.FieldValue.serverTimestamp,
      type: 'system',
      body: message,
    })
  })
