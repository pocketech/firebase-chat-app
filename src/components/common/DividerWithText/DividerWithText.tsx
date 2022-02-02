import type { FlexProps } from '@chakra-ui/react'
import { Divider, Flex, Text, useColorModeValue } from '@chakra-ui/react'

/**
 * --- Text ---
 */
export const DividerWithText: React.FC<FlexProps> = ({ children, ...flexProps }) => {
  return (
    <Flex align="center" color={useColorModeValue('gray.300', 'gray.600')} as="p" {...flexProps}>
      <Divider flex="1" borderColor="currentColor" as="span" aria-hidden="true" />
      <Text px="3" color="currentcolor" fontWeight="medium" as="span">
        {children}
      </Text>
      <Divider flex="1" borderColor="currentColor" as="span" aria-hidden="true" />
    </Flex>
  )
}
