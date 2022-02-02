import { Center, Flex, Image, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'

import { AuthJudgeBox } from '@/components/feature/auth/components/AuthJudgeBox'

const Page: NextPage = () => {
  return (
    <Flex as="main" flex="1">
      <Center flex="2">
        <VStack spacing="16">
          <Image src="images/logo.svg" width="64" />
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
