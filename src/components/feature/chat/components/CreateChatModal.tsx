import type { ModalProps } from '@chakra-ui/react'
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
  useCheckboxGroup,
  useToast,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiOutlineX } from 'react-icons/hi'

import { Avatar } from '@/components/common/Avatar'
import { pagesPath } from '@/libs/$path'

import { createChat } from '../api/createChat'
import { MAX_MEMBER_COUNT } from '../constants'
import { useUsers } from '../hooks/useUsers'
import { InviteUserCheckbox } from './InviteUserCheckbox'

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
  const isLimitOver = selectedUserIds.length > MAX_MEMBER_COUNT

  const { users } = useUsers()

  const onClick = async () => {
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
            {users
              ? users
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
              : [...Array(4)].map((_, index) => {
                  // HACK: ESLint の一時的なエラー回避
                  const key = `skelton-${index}`

                  return <Skeleton height="14" key={key} />
                })}
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
            onClick={onClick}
          >
            作成
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
