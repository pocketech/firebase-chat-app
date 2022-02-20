import * as admin from 'firebase-admin'

import { updateMessageAuthor } from './modules/updateMessageAuthor'
import { createUserDocument } from './modules/createUserDocument'
import { updateDisplayNameAndPhotoURL } from './modules/updateDisplayNameAndPhotoURL'
import { updateRecentMessage } from './modules/updateRecentMessage'

admin.initializeApp()

exports.updateMessageAuthor = updateMessageAuthor
exports.createUserDocument = createUserDocument

exports.updateDisplayNameAndPhotoURL = updateDisplayNameAndPhotoURL
exports.updateRecentMessage = updateRecentMessage
