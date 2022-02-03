import { verifyPasswordResetCode as fbVerifyPasswordResetCode } from 'firebase/auth'

import { auth } from '@/libs/firebase'

export const verifyPasswordResetCode = (code: string) => {
  return fbVerifyPasswordResetCode(auth, code)
}
