import * as functions from "firebase-functions"

import * as admin from "firebase-admin"

admin.initializeApp();

exports.createUserDocument = functions.region('asia-northeast1').auth.user().onCreate(async user => {
  const userUid = user.uid;
  const userEmail = user.email;
  
  console.info(user.displayName)

  // admin.auth().getUser() 経由で取得, 取得するまでawait
  const authedUser = await admin.auth().getUser(userUid);
  const userName = authedUser.displayName;
  
  const newUser = {
    email: userEmail,
    name: userName
  };

  return admin
    .firestore()
    .collection("users")
    .doc(userUid)
    .set(newUser);
});



