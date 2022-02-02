import { fetchSignInMethodsForEmail, SignInMethod } from 'firebase/auth'

import { auth } from '@/libs/firebase'

export const checkIfUserExists = async (email: string) => {
  const methods = await fetchSignInMethodsForEmail(auth, email)

  return methods.some((method) => method === SignInMethod.EMAIL_PASSWORD)
}
