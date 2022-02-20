import { region } from 'firebase-functions'

import { firestore } from 'firebase-admin'

export const createInviteMessage = region('asia-northeast1')
  .firestore.document('chats/{chatId}')
  .onUpdate(async (change, context) => {
    const beforeMemberIds: string[] = change.before.data().memberIds
    const afterMemberIds: string[] = change.after.data().memberIds

    // メンバーの数が増えたときのみ実行する
    if (beforeMemberIds.length >= afterMemberIds.length) return
    // 増えたメンバーのidを得る
    const additionalMemberIds = afterMemberIds.filter(
      (memberId) => !beforeMemberIds.includes(memberId)
    )

    const additionalMembers = await firestore()
      .collection('users')
      .where(firestore.FieldPath.documentId(), 'in', additionalMemberIds)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name as string,
        }))
      )

    const message = `${additionalMembers
      .map((member) => member.name)
      .join(', ')} がチャットに招待されました`

    const colRef = firestore().collection('chats').doc(context.params.chatId).collection('messages')

    return colRef.add({
      createdAt: firestore.FieldValue.serverTimestamp,
      updatedAt: firestore.FieldValue.serverTimestamp,
      type: 'system',
      body: message,
    })
  })
