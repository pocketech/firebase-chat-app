import * as functions from "firebase-functions"

import * as admin from "firebase-admin"

import updateMessageAuthor = require('./modules/updateMessageAuthor');

admin.initializeApp();

exports.updateMessageAuthor = updateMessageAuthor
exports.createUserDocument = functions.region('asia-northeast1').auth.user().onCreate(async user => {
  const userUid = user.uid;
  
  console.info(user.displayName)

  // admin.auth().getUser() 経由で取得, 取得するまでawait
  const authedUser = await admin.auth().getUser(userUid);
  const userName = authedUser.displayName;
  
  const newUser= {
    name: userName,
  };

  return admin
    .firestore()
    .collection("users")
    .doc(userUid)
    .set(newUser);
});

exports.updateDisplayNameAndPhotoURL = functions.region('asia-northeast1').firestore.document('users/{userId}').onUpdate( (change, context) => {
  const newName = change.after.data().name
  const newAvatarUrl = change.after.data().avatarUrl
  
  console.info(newName)

  return admin.auth().updateUser(context.params.userId, {displayName: newName, photoURL: newAvatarUrl})

});

exports.updateRecentMessage = functions.region('asia-northeast1').firestore.document('chats/{chatId}/messages/{messageId}').onCreate((snap, context) => {
  const newMessage = snap.data()

  const docRef = admin.firestore().collection("chats").doc(context.params.chatId)

  return docRef.update({
    recentMessage : {
      body: newMessage.body || (newMessage.attachmentFileUrls && '画像が送信されました'),
      createdAt: newMessage.createdAt
    }
  })
})