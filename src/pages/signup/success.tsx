import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Stack } from '@chakra-ui/react'
import type { NextPageWithLayout } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { AuthFlowLayout } from '@/components/layout/AuthFlowLayout'
import { pagesPath } from '@/libs/$path'

export type OptionalQuery = {
  continueUrl?: string
}

const Page: NextPageWithLayout = () => {
  const { query } = useRouter()
  const continueUrl = query.continueUrl as string | undefined

  return (
    <Alert
      rounded="md"
      status="success"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        本登録が完了しました
      </AlertTitle>
      <AlertDescription maxWidth="sm">プロフィールを充実させましょう</AlertDescription>
      <Stack mt="8">
        <NextLink href={pagesPath.profile.$url()} passHref>
          <Button as="a" colorScheme="blue">
            プロフィール編集画面へ
          </Button>
        </NextLink>
        <NextLink href={continueUrl ? continueUrl : pagesPath.chat._params([]).$url()} passHref>
          <Button as="a" colorScheme="blue" variant="ghost">
            アプリへ戻る
          </Button>
        </NextLink>
      </Stack>
    </Alert>
  )
}

Page.getLayout = (page: React.ReactElement) => <AuthFlowLayout>{page}</AuthFlowLayout>
export default Page
