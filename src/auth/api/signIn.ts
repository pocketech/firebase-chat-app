import { signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '@/libs/firebase'

type LoginOption = {
  email: string
  password: string
}

export const signIn = ({ email, password }: LoginOption) => {
  return signInWithEmailAndPassword(auth, email, password)
}
