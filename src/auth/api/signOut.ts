import { signOut as firebaseSignOut } from 'firebase/auth'

import { auth } from '@/libs/firebase'

export const singOut = () => {
  return firebaseSignOut(auth)
}
