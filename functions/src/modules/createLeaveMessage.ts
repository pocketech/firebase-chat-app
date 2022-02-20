import { region } from 'firebase-functions'

import { firestore } from 'firebase-admin'

export const createLeaveMessage = region('asia-northeast1')
  .firestore.document('chats/{chatId}')
  .onUpdate(async (change, context) => {
    const beforeMemberIds: string[] = change.before.data().memberIds
    const afterMemberIds: string[] = change.after.data().memberIds

    // メンバーの数が減ったとき(=誰かが退出したとき)のみ実行する
    if (beforeMemberIds.length <= afterMemberIds.length) return
    // 退出したメンバーのidを得る
    const leavedMemberId = beforeMemberIds.find((memberId) => !afterMemberIds.includes(memberId))

    if (!leavedMemberId) return

    const leavedMemberName = await firestore()
      .collection('users')
      .doc(leavedMemberId)
      .get()
      .then((doc) => {
        if (doc.exists) return 'unknown'

        return doc.data()?.name
      })

    const message = `${leavedMemberName} がチャットから退出しました`

    const colRef = firestore().collection('chats').doc(context.params.chatId).collection('messages')

    return colRef.add({
      createdAt: firestore.FieldValue.serverTimestamp,
      updatedAt: firestore.FieldValue.serverTimestamp,
      type: 'system',
      body: message,
    })
  })
