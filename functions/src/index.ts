import * as admin from 'firebase-admin'

import { updateMessageAuthor } from './modules/updateMessageAuthor'
import { createUserDocument } from './modules/createUserDocument'
import { updateDisplayNameAndPhotoURL } from './modules/updateDisplayNameAndPhotoURL'
import { updateRecentMessage } from './modules/updateRecentMessage'
import { deleteMessages } from './modules/deleteMessages'
import { deleteUserDocument } from './modules/deleteUserDocument'
import { deleteMessageAuthor } from './modules/deleteMessageAuthor'
import { deleteChatMember } from './modules/deleteChatMember'
import { createFirstMessage } from './modules/createFirstMessage'
import { createInviteMessage } from './modules/createInviteMessage'
import { createLeaveMessage } from './modules/createLeaveMessage'

admin.initializeApp()

exports.createUserDocument = createUserDocument
exports.updateDisplayNameAndPhotoURL = updateDisplayNameAndPhotoURL

exports.updateMessageAuthor = updateMessageAuthor
exports.updateRecentMessage = updateRecentMessage
exports.deleteMessages = deleteMessages

// アカウント削除時の処理。上から順に作用する
exports.deleteUserDocument = deleteUserDocument
exports.deleteChatMember = deleteChatMember
exports.deleteMessageAuthor = deleteMessageAuthor

// システムメッセージに関する処理
exports.createFirstMessage = createFirstMessage
exports.createInviteMessage = createInviteMessage
exports.createLeaveMessage = createLeaveMessage
