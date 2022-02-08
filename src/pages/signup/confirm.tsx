import { Alert, AlertIcon, AlertTitle, Box, Button, Text } from '@chakra-ui/react'
import { sendEmailVerification } from 'firebase/auth'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { useAuthUser } from '@/auth/hooks'
import { Card } from '@/components/common/Card'
import { AuthFlowLayout } from '@/components/layout/AuthFlowLayout'
import { pagesPath } from '@/libs/$path'

const Page: NextPageWithLayout = () => {
  const { authenticatedUser } = useAuthUser()
  // HACK: authenticatedUserのemailVerifiedの変化は、onAuthStateChangedの発火対象外であるため
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const { replace } = useRouter()

  useEffect(() => {
    if (authenticatedUser) {
      const timerId = setInterval(() => {
        // HACK: authenticatedUserのemailVerifiedの変化は、onAuthStateChangedの発火対象外であるため
        authenticatedUser.reload()
        setIsEmailVerified(authenticatedUser.emailVerified)
      }, 1000)

      return () => clearInterval(timerId)
    }
  }, [authenticatedUser])

  useEffect(() => {
    if (isEmailVerified) {
      console.info('発火')
      replace(pagesPath.signup.success.$url())
    }
  }, [isEmailVerified])

  if (!authenticatedUser) return null

  if (authenticatedUser && authenticatedUser.emailVerified)
    return (
      <Alert status="error">
        <AlertIcon /> <AlertTitle mr={2}>権限がありません</AlertTitle>
      </Alert>
    )

  return (
    <Card spacing="8">
      <Box as="h1" textStyle="blockTitle">
        まだ登録は完了していません
      </Box>
      <Box textStyle="label">
        <Text>{authenticatedUser.email}に認証用のリンクを送信しました</Text>
      </Box>

      <Button colorScheme="blue" onClick={() => sendEmailVerification(authenticatedUser)}>
        認証メールを再送する
      </Button>
    </Card>
  )
}

Page.getLayout = (page: React.ReactElement) => <AuthFlowLayout>{page}</AuthFlowLayout>
export default Page
