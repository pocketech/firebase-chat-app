import type { SpaceProps, StackProps } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/react'
import { Skeleton } from '@chakra-ui/react'
import { useCheckboxGroup } from '@chakra-ui/react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Stack,
  useEditableControls,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { HiOutlineX } from 'react-icons/hi'

import { Avatar } from '@/components/common/Avatar'
import { pagesPath } from '@/libs/$path'
import type { User } from '@/types/user'

import { useUsers } from '../../../../hooks/useUsers'
import { checkIfChatExists } from '../api/checkIfChatExists'
import { deleteChat } from '../api/deleteChat'
import { leaveChat, updateChatMembers, updateChatName } from '../api/updateChat'
import { MAX_MEMBER_COUNT } from '../constants'
import { generateChatId } from '../utils/generateChatId'
import { InviteUserCheckbox } from './InviteUserCheckbox'

const EditableControls: React.VFC<SpaceProps> = ({ ...others }) => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
    useEditableControls()

  return isEditing ? (
    <ButtonGroup size="sm" spacing="4" {...others}>
      <Button variant="outline" {...getCancelButtonProps()}>
        キャンセル
      </Button>
      <Button colorScheme="blue" {...getSubmitButtonProps()}>
        更新
      </Button>
    </ButtonGroup>
  ) : (
    <Button size="sm" variant="ghost" colorScheme="blue" {...others} {...getEditButtonProps()}>
      編集
    </Button>
  )
}

type Props = {
  chatId: string
  chatName: string
  chatMembers: User[]
  userId: string
  isAdmin: boolean
} & StackProps
export const ChatInfoScreen: React.VFC<Props> = ({
  chatId,
  chatName,
  chatMembers,
  userId,
  isAdmin,
  ...stackProps
}) => {
  const { push } = useRouter()
  const [isChatDeleteModalOpen, setIsChatDeleteModalOpen] = useState(false)
  const onChatDeleteModalClose = () => setIsChatDeleteModalOpen(false)
  const onChatDeleteModalOpen = () => setIsChatDeleteModalOpen(true)
  const chatDeleteCancelRef = useRef<HTMLButtonElement>(null)

  const [isChatLeaveModalOpen, setIsChatLeaveModalOpen] = useState(false)
  const onChatLeaveModalClose = () => setIsChatLeaveModalOpen(false)
  const onChatLeaveModalOpen = () => setIsChatLeaveModalOpen(true)
  const chatLeaveCancelRef = useRef<HTMLButtonElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const [isInvalid, setIsInvalid] = useState(false)
  const {
    // 選択したユーザIDの配列。自分は含まない。
    value: selectedUserIds,
    getCheckboxProps,
    setValue: setSelectedUserIds,
  } = useCheckboxGroup()
  const isLimitOver = selectedUserIds.length + chatMembers.length > MAX_MEMBER_COUNT

  const { users } = useUsers()
  const chatMemberIds = chatMembers.map((member) => member.id)
  const invitableUsers = users?.filter((user) => !chatMemberIds.includes(user.id))

  const onClick = async () => {
    setIsSubmitting(true)
    try {
      const memberIdsForDuplicateCheck = [...chatMemberIds, ...selectedUserIds] as string[]
      const chatId = await generateChatId(memberIdsForDuplicateCheck)

      const isDuplicated = await checkIfChatExists(chatId)

      if (isDuplicated) throw new Error('このメンバーのチャットは既に存在しています')

      await updateChatMembers({ chatId, additionalUserIds: selectedUserIds as string[] })

      toast({
        status: 'success',
        title: 'メンバーを更新しました',
      })
      setSelectedUserIds([])
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
    <>
      <Stack spacing="8" {...stackProps}>
        <Stack as="section" spacing="4">
          <Box textColor="gray.500" textStyle="label">
            チャット名
          </Box>
          <Editable
            d="flex"
            alignItems="center"
            defaultValue={chatName}
            onSubmit={(name) => {
              if (name.length === 0) return setIsInvalid(true)
              setIsInvalid(false)
              updateChatName({ chatId, name })
            }}
          >
            <EditablePreview />
            <EditableInput
              mr="8"
              // @see https://github.com/chakra-ui/chakra-ui/issues/3476
              aria-invalid={isInvalid}
              _invalid={{ outlineColor: 'red.300' }}
              onKeyDown={(e) => {
                // 日本語変換時に送信されないように
                if (e.keyCode === 229) e.preventDefault()
              }}
            />
            <EditableControls ml="auto" />
          </Editable>
          {isInvalid && <Box color="red">不正な入力です</Box>}
        </Stack>
        <Stack as="section" spacing="4">
          <Box textColor="gray.500" textStyle="label">
            メンバー
          </Box>
          <Flex align="center" gridGap="8" wrap="wrap">
            {chatMembers.map((chatMember) => (
              <Flex align="center" gridGap="4" key={chatMember.id}>
                <Avatar name={chatMember.name} src={chatMember.avatarUrl} />
                <Box>{chatMember.name}</Box>
              </Flex>
            ))}
          </Flex>
        </Stack>
        <Box as="section">
          <Box textStyle="subSubBlockTitle">メンバーの招待</Box>
          <Flex wrap="wrap" mt="4" mb="4">
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
          <Stack spacing="4">
            {!invitableUsers &&
              [...Array(4)].map((_, index) => {
                // HACK: ESLint の一時的なエラー回避
                const key = `skelton-${index}`

                return <Skeleton height="14" key={key} />
              })}
            {invitableUsers &&
              (invitableUsers.length === 0 ? (
                <Box>招待可能なユーザーが見つかりません</Box>
              ) : (
                invitableUsers.map((user) => (
                  <InviteUserCheckbox
                    key={user.id}
                    user={user}
                    {...getCheckboxProps({
                      value: user.id,
                    })}
                  />
                ))
              ))}
          </Stack>
          {isLimitOver && (
            <Box color="red.500" mt="2" mb="-2">
              チャットに参加できるのは{MAX_MEMBER_COUNT}人までです
            </Box>
          )}
          {invitableUsers && invitableUsers.length > 0 && (
            <Button
              mt="8"
              w="fit-content"
              isDisabled={isLimitOver || selectedUserIds.length === 0}
              colorScheme="blue"
              isLoading={isSubmitting}
              onClick={onClick}
            >
              招待する
            </Button>
          )}
        </Box>

        {isAdmin ? (
          <Box alignSelf="end">
            <Button size="sm" colorScheme="red" w="fit-content" onClick={onChatDeleteModalOpen}>
              チャットの削除
            </Button>
          </Box>
        ) : (
          <Box alignSelf="end">
            <Button
              size="sm"
              colorScheme="red"
              w="fit-content"
              variant="outline"
              onClick={onChatLeaveModalOpen}
            >
              チャットの退出
            </Button>
          </Box>
        )}
      </Stack>
      {/* チャット削除ダイアログ */}
      <AlertDialog
        isCentered
        isOpen={isChatDeleteModalOpen}
        leastDestructiveRef={chatDeleteCancelRef}
        onClose={onChatDeleteModalClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              チャットの削除
            </AlertDialogHeader>

            <AlertDialogBody>
              このチャットルームを削除します。よろしいですか？
              <Box mt="2" textStyle="label" textAlign="center" textColor="red.400">
                ※ 紐づくメッセージと添付画像もすべて削除されます。
              </Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={chatDeleteCancelRef} variant="ghost" onClick={onChatDeleteModalClose}>
                キャンセル
              </Button>
              <Button
                ml={3}
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  deleteChat(chatId)
                    .then(() => {
                      toast({
                        status: 'success',
                        title: 'チャットを削除しました',
                      })
                      onChatDeleteModalClose()
                      push(pagesPath.chat._params([]).$url())
                    })
                    .catch((e) => {
                      console.error(e)
                      toast({
                        status: 'error',
                        title: 'チャットの削除に失敗しました',
                      })
                    })
                }}
              >
                削除する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {/* チャット退出ダイアログ */}
      <AlertDialog
        isCentered
        isOpen={isChatLeaveModalOpen}
        leastDestructiveRef={chatLeaveCancelRef}
        onClose={onChatLeaveModalClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              チャットの退出
            </AlertDialogHeader>

            <AlertDialogBody>
              このチャットルームから退出します。よろしいですか？
              <Box mt="2" textStyle="label" textAlign="center" textColor="red.400">
                ※ 送信したメッセージは削除されませんので事前に削除することをおすすめします。
              </Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={chatLeaveCancelRef} variant="ghost" onClick={onChatLeaveModalClose}>
                キャンセル
              </Button>
              <Button
                ml={3}
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  leaveChat({ chatId, userId })
                    .then(() => {
                      toast({
                        status: 'success',
                        title: 'チャットから退出しました',
                      })
                      onChatLeaveModalClose()
                      push(pagesPath.chat._params([]).$url())
                    })
                    .catch((e) => {
                      console.error(e)
                      toast({
                        status: 'error',
                        title: 'チャットの退出に失敗しました',
                      })
                    })
                }}
              >
                退出する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
