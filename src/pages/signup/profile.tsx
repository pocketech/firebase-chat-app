import { Flex } from '@chakra-ui/react'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  // const { authenticatedUser } = useAuthUser()
  // const toast = useToast()

  // useEffect(() => {
  //   if (authenticatedUser?.emailVerified) {
  //     console.info('発火')
  //     toast({
  //       title: 'メール認証が完了しました',
  //       status: 'success',
  //       isClosable: true,
  //     })
  //   }
  // }, [authenticatedUser?.emailVerified])

  // useEffect(() => {
  //   if (authenticatedUser) {
  //     const timerId = setInterval(() => {
  //       authenticatedUser.reload()
  //       console.info(authenticatedUser)
  //     }, 1000)

  //     return () => clearInterval(timerId)
  //   }
  // }, [authenticatedUser])

  return (
    <Flex h="100vh" bg="gray.600">
      テスト
    </Flex>
  )
}

export default Page
