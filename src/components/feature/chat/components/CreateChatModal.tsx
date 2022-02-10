import type { ModalProps, UseCheckboxProps } from '@chakra-ui/react'
import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  useCheckbox,
  useCheckboxGroup,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { HiCheckCircle, HiOutlineX } from 'react-icons/hi'

import { Avatar } from '@/components/common/Avatar'
import type { User } from '@/types/user'

import { useUsersOnce } from '../hooks/useUsersOnce'

const InviteUserCheckbox: React.VFC<
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

type Props = Omit<ModalProps, 'children'> & {
  onSubmit: (text: string) => Promise<void>
}

export const CreateChatModal: React.VFC<Props> = ({ onSubmit, ...others }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const { value, getCheckboxProps, setValue } = useCheckboxGroup()

  const { users } = useUsersOnce()

  const onSubmitMessage = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit('hoge')
      toast({
        status: 'success',
        title: 'メッセージを送信しました',
      })
      others.onClose()
    } catch (_e) {
      toast({
        status: 'error',
        title: 'メッセージの送信に失敗しました',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isCentered size="xl" {...others}>
      <ModalOverlay />

      <ModalContent mx="4">
        <ModalHeader textAlign="center" textStyle="subBlockTitle">
          メンバー選択
        </ModalHeader>
        <ModalCloseButton mr="-1" borderRadius="full" onClick={() => setValue([])} />

        <ModalBody>
          <Flex wrap="wrap" mb="4">
            {users &&
              value.map((selectedUserId) => {
                const user = users.find((user) => user.id === selectedUserId)!

                return (
                  <Button
                    key={selectedUserId}
                    variant="ghost"
                    py="1"
                    px="2"
                    rightIcon={<Icon as={HiOutlineX} boxSize="3" color="gray.600" />}
                    iconSpacing="3"
                    onClick={() =>
                      setValue(value.filter((memberId) => memberId !== selectedUserId))
                    }
                  >
                    <Flex align="center" gridGap="2">
                      <Avatar size="xs" name={user.name} src={user.avatarUrl} />
                      <Box textStyle="label">{user.name}</Box>
                    </Flex>
                  </Button>
                )
              })}
          </Flex>
          <Stack spacing="4" overflowY="auto" maxH="30vh">
            {users ? (
              users.map((user) => (
                <InviteUserCheckbox
                  key={user.id}
                  user={user}
                  {...getCheckboxProps({
                    value: user.id,
                  })}
                />
              ))
            ) : (
              <Skeleton />
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={() => {
              others.onClose()
              setValue([])
            }}
          >
            キャンセル
          </Button>
          <Button colorScheme="blue" isLoading={isSubmitting} onClick={onSubmitMessage}>
            招待
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
