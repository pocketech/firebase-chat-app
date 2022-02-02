import { applyActionCode as fbApplyActionCode } from 'firebase/auth'

import { auth } from '@/libs/firebase'

export const applyActionCode = (oobCode: string) => {
  return fbApplyActionCode(auth, oobCode)
}
