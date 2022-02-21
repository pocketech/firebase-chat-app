import { region } from 'firebase-functions'

import { storage } from 'firebase-admin'

export const deleteChatImages = region('asia-northeast1')
  .firestore.document('chats/{chatId}')
  .onDelete(async (_snap, context) => {
    const targetChatId = context.params.chatId

    return storage()
      .bucket()
      .deleteFiles({
        prefix: `chats/${targetChatId}`,
      })
  })
