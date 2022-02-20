import * as admin from 'firebase-admin'

import { updateMessageAuthor } from './modules/updateMessageAuthor'
import { createUserDocument } from './modules/createUserDocument'
import { updateDisplayNameAndPhotoURL } from './modules/updateDisplayNameAndPhotoURL'
import { updateRecentMessage } from './modules/updateRecentMessage'
import { deleteMessages } from './modules/deleteMessages'

admin.initializeApp()

exports.updateMessageAuthor = updateMessageAuthor
exports.createUserDocument = createUserDocument

exports.updateDisplayNameAndPhotoURL = updateDisplayNameAndPhotoURL
exports.updateRecentMessage = updateRecentMessage
exports.deleteMessages = deleteMessages
