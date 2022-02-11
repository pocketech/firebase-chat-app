import type { SpacerProps } from '@chakra-ui/react'
import { chakra, Icon, VStack } from '@chakra-ui/react'
import { HiOutlineChatAlt2 } from 'react-icons/hi'

export const Empty: React.VFC<SpacerProps> = ({ ...spacerProps }) => {
  return (
    <VStack spacing="4" {...spacerProps}>
      <Icon as={HiOutlineChatAlt2} boxSize="16" color="gray.300" />
      <chakra.h1 textStyle="screenTitle">Let's Chat !!</chakra.h1>
    </VStack>
  )
}
