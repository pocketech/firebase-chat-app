import type { SpacerProps } from '@chakra-ui/react'
import { chakra, Icon, Spacer, VStack } from '@chakra-ui/react'
import { HiOutlineUserAdd } from 'react-icons/hi'

export const Empty: React.VFC<SpacerProps> = ({ ...spacerProps }) => {
  return (
    <VStack {...spacerProps}>
      <Icon as={HiOutlineUserAdd} w="16" h="16" color="gray.300" />
      <chakra.h1 fontSize={{ base: 'lg', lg: '3xl' }} fontWeight={{ base: 'medium', lg: 'bold' }}>
        メッセージはありません
      </chakra.h1>
      <Spacer />
    </VStack>
  )
}
