import { confirmPasswordReset as fbConfirmPasswordReset } from 'firebase/auth'

import { auth } from '@/libs/firebase'

export const confirmPasswordReset = ({
  oobCode,
  newPassword,
}: {
  oobCode: string
  newPassword: string
}) => {
  return fbConfirmPasswordReset(auth, oobCode, newPassword)
}
