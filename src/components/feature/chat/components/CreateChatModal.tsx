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
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiCheckCircle, HiOutlineX } from 'react-icons/hi'

import { Avatar } from '@/components/common/Avatar'
import { pagesPath } from '@/libs/$path'
import type { User } from '@/types/user'

import { createChat } from '../api/createChat'
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
  createdBy: string
}

export const CreateChatModal: React.VFC<Props> = ({ createdBy, ...others }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const { push } = useRouter()
  const {
    // 選択したユーザIDの配列。自分は含まない。
    value: selectedUserIds,
    getCheckboxProps,
    setValue: setSelectedUserIds,
  } = useCheckboxGroup()
  const MAX_MEMBER_COUNT = 10
  const isLimitOver = selectedUserIds.length > MAX_MEMBER_COUNT

  const { users } = useUsersOnce()

  const onCreate = async () => {
    setIsSubmitting(true)
    try {
      const chatId = await createChat({ selectedUserIds: selectedUserIds as string[], createdBy })

      toast({
        status: 'success',
        title: 'チャットを作成しました',
      })
      setSelectedUserIds([])
      others.onClose()
      push(pagesPath.chat._params([chatId]).$url())
    } catch (e) {
      console.error(e)
      toast({
        status: 'error',
        title: 'エラーが発生しました',
        description: e instanceof Error ? e.message : '',
        isClosable: true,
        duration: null,
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
        <ModalCloseButton mr="-1" borderRadius="full" onClick={() => setSelectedUserIds([])} />

        <ModalBody>
          <Flex wrap="wrap" mb="4">
            {users &&
              selectedUserIds.map((selectedUserId) => {
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
                      setSelectedUserIds(
                        selectedUserIds.filter((memberId) => memberId !== selectedUserId)
                      )
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
              users
                .filter((user) => user.id !== createdBy)
                .map((user) => (
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
          {isLimitOver && (
            <Box color="red.500" mt="2" mb="-2">
              チャットに参加できるのは{MAX_MEMBER_COUNT}人までです
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            mr="3"
            onClick={() => {
              others.onClose()
              setSelectedUserIds([])
            }}
          >
            キャンセル
          </Button>
          <Button
            isDisabled={isLimitOver || selectedUserIds.length === 0}
            colorScheme="blue"
            isLoading={isSubmitting}
            onClick={onCreate}
          >
            作成
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
