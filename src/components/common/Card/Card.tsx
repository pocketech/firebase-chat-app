import type { StackProps } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'

export const Card: React.FC<StackProps> = ({ children, ...stackProps }) => {
  return (
    <Stack
      bgColor="white"
      shadow="md"
      rounded="md"
      py="8"
      px={{ base: '4', sm: '10' }}
      {...stackProps}
    >
      {children}
    </Stack>
  )
}
