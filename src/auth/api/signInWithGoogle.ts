import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'

import { auth, db } from '@/libs/firebase'

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    const credential = await signInWithPopup(auth, googleProvider)
    const user = credential.user
    const q = query(collection(db, 'users'), where('uid', '==', user.uid))
    const docs = await getDocs(q)

    if (docs.docs.length === 0) {
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      })
    }
  } catch (err) {
    console.error(err)
  }
}
