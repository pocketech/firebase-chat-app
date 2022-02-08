import { Center, Flex, Image, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useAuthUser } from '@/auth/hooks'
import { Logo } from '@/components/common/Logo'
import { AuthJudgeBox } from '@/components/feature/auth/components/AuthJudgeBox'
import { pagesPath } from '@/libs/$path'

const Page: NextPage = () => {
  const { push } = useRouter()

  const { authenticatedUser } = useAuthUser()

  // ログイン済の場合はリダイレクト
  useEffect(() => {
    if (authenticatedUser) push(pagesPath.chat._params([]).$url())
  }, [authenticatedUser])

  return (
    <Flex as="main" flex="1">
      <Center flex="2">
        <VStack spacing="16">
          <Logo width="64" />
          <AuthJudgeBox />
        </VStack>
      </Center>
      <Image
        flex="1"
        src="images/main_image.svg"
        objectFit="contain"
        display={{ base: 'none', lg: 'initial' }}
      />
    </Flex>
  )
}

export default Page
