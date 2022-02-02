import { createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword } from 'firebase/auth'

import { auth } from '@/libs/firebase'

type SignUpOption = {
  email: string
  password: string
}
export const createUserWithEmailAndPassword = async ({ email, password }: SignUpOption) => {
  const user = await fbCreateUserWithEmailAndPassword(auth, email, password)

  return user
}
