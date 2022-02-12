import type { UseCheckboxProps } from '@chakra-ui/react'
import { Box, Flex, Icon, useCheckbox } from '@chakra-ui/react'
import { HiCheckCircle } from 'react-icons/hi'

import { Avatar } from '@/components/common/Avatar'
import type { User } from '@/types/user'

export const InviteUserCheckbox: React.VFC<
  { user: Pick<User, 'name' | 'avatarUrl'> } & UseCheckboxProps
> = ({ user, ...props }) => {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)

  return (
    <Flex
      as="label"
      align="center"
      gridGap="2"
      rounded="lg"
      px="3"
      py="1"
      cursor="pointer"
      _hover={{ bgColor: 'gray.200' }}
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Flex align="center" gridGap="4">
        <Avatar name={user.name} src={user.avatarUrl} />
        <Box {...getLabelProps()}>{user.name}</Box>
      </Flex>
      <Box ml="auto" rounded="full" boxSize="8" {...getCheckboxProps()}>
        {state.isChecked && <Icon as={HiCheckCircle} boxSize="8" color="green.500" />}
      </Box>
    </Flex>
  )
}
