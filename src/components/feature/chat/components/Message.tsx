import 'linkify-plugin-mention'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar as ChakraAvatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import Linkify from 'linkify-react'
import { useRef, useState } from 'react'
import { HiOutlineDotsVertical, HiOutlinePhotograph, HiOutlineTrash } from 'react-icons/hi'

import { Avatar } from '@/components/common/Avatar'
import { formatDateFromUTC } from '@/libs/dayjs'
import styles from '@/styles/Linkify.module.css'

import type { Message as MessageType } from '../types'

type Props = {
  message: MessageType
  isAuthor?: boolean
  onUpdateMessage: (text: string) => Promise<void>
  onDeleteMessage: () => Promise<void>
  onDeleteImage: (url: string) => Promise<void>
}

export const Message: React.VFC<Props> = ({
  message,
  isAuthor,
  onUpdateMessage,
  onDeleteMessage,
  onDeleteImage,
}) => {
  const toast = useToast()

  const [isEdit, setIsEdit] = useState(false)
  const [text, setText] = useState(message.body)
  const {
    onOpen: onUserInfoOpen,
    onClose: onUserInfoClose,
    isOpen: isUserInfoOpen,
  } = useDisclosure()

  const onUpdate = () => {
    onUpdateMessage(text)
      .then(() => {
        toast({
          status: 'success',
          title: 'メッセージを更新しました',
        })
      })
      .catch((_e) => {
        toast({
          status: 'error',
          title: 'メッセージの更新に失敗しました',
        })
      })
    setIsEdit(false)
  }

  const onDelete = () => {
    onDeleteMessage()
      .then(() => {
        toast({
          status: 'success',
          title: 'メッセージを削除しました',
        })
        onMessageDeleteModalClose()
      })
      .catch((_e) => {
        toast({
          status: 'error',
          title: 'メッセージの削除に失敗しました',
        })
      })
  }

  const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] = useState(false)
  const onMessageDeleteModalClose = () => setIsMessageDeleteModalOpen(false)
  const onMessageDeleteModalOpen = () => setIsMessageDeleteModalOpen(true)
  const messageDeleteCancelRef = useRef<HTMLButtonElement>(null)

  const [isFileDeleteModalOpen, setIsFileDeleteModalOpen] = useState(false)
  const onFileDeleteModalClose = () => setIsFileDeleteModalOpen(false)
  const onFileDeleteModalOpen = () => setIsFileDeleteModalOpen(true)
  const fileDeleteCancelRef = useRef<HTMLButtonElement>(null)

  const hasAttachmentFile = message.attachmentFileUrls.length > 0

  const linkifyOptions = {
    className: function (_href: string, type: string) {
      if (type === 'mention') {
        return styles.mention
      }

      return styles.link
    },
    target: {
      url: '_blank',
    },
  }

  return (
    <>
      <Flex direction="column" gridGap="0.5">
        {/* メッセージのメタ情報(作者, 作成日等) */}
        <Flex gridGap="2" align="center">
          {message.author ? (
            <Popover
              isOpen={isUserInfoOpen}
              onOpen={onUserInfoOpen}
              onClose={onUserInfoClose}
              placement="auto-end"
              id="userinfo-popover"
            >
              <PopoverTrigger>
                <Avatar
                  name={message.author.name}
                  src={message.author.avatarUrl}
                  size="sm"
                  as="button"
                />
              </PopoverTrigger>
              <PopoverContent
                w="unset"
                // HACK: キーボード操作時以外はフォーカスリングを表示しない
                sx={{ '&:not(:focus-visible)': { boxShadow: 'none' } }}
              >
                <Box>
                  <Avatar
                    name={message.author.name}
                    src={message.author.avatarUrl}
                    rounded="base"
                    boxSize="52"
                  />
                  <Stack m="4">
                    <Box textStyle="blockTitle">{message.author.name}</Box>
                    <Box textStyle="paragraphSm" whiteSpace="pre-wrap" maxW="fit-content">
                      {message.author.selfIntroduction}
                    </Box>
                  </Stack>
                </Box>
              </PopoverContent>
            </Popover>
          ) : (
            <ChakraAvatar bg="gray.500" size="sm" />
          )}
          <Text textStyle="label">{message.author ? message.author.name : 'unknown'}</Text>
          <Text textColor="gray.500" textStyle="captionSm">
            {formatDateFromUTC(message.createdAt, 'Time')}
          </Text>
          {isAuthor && (
            <Menu id="message-edit-popover" isLazy>
              <MenuButton
                ml={{ base: 'auto', md: 'unset' }}
                aria-label="設定"
                as={IconButton}
                variant="ghost"
                icon={<Icon as={HiOutlineDotsVertical} boxSize="4" />}
              />

              <MenuList>
                <MenuItem onClick={() => setIsEdit(true)}>編集</MenuItem>
                <MenuItem onClick={onMessageDeleteModalOpen} color="red.500">
                  削除
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
        {/* メッセージテキスト */}
        {isEdit ? (
          <>
            {/* TODO: Editableで置き換える */}
            <Textarea value={text} onChange={(e) => setText(e.target.value)} />
            <ButtonGroup ml="auto" size="sm" mt="2">
              <Button variant="outline" onClick={() => setIsEdit(false)}>
                キャンセル
              </Button>
              <Button onClick={onUpdate} colorScheme="blue">
                更新する
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <Box ml="10" textStyle="body" whiteSpace="pre-wrap">
            <Linkify options={linkifyOptions}>{message.body}</Linkify>
          </Box>
        )}

        {/* 添付画像の表示 */}
        {hasAttachmentFile && (
          <Flex wrap="wrap" alignItems="center" gridGap="4" mt="2">
            {message.attachmentFileUrls.map((url) => (
              <Flex key={url} align="end">
                <Flex maxW={400}>
                  <Image
                    src={url}
                    maxH={400}
                    rounded="md"
                    fallback={
                      <Icon
                        as={HiOutlinePhotograph}
                        color="gray.50"
                        bgColor="gray.500"
                        boxSize={200}
                        rounded="md"
                      />
                    }
                  />
                </Flex>
                <IconButton
                  onClick={onFileDeleteModalOpen}
                  display={isAuthor ? 'inline-flex' : 'none'}
                  icon={<HiOutlineTrash fontSize="1.4rem" />}
                  aria-label="削除"
                  size="sm"
                  variant="ghost"
                  opacity=".5"
                  _hover={{ opacity: 1, color: 'red.400' }}
                  _focus={{ opacity: 1, color: 'red.400' }}
                />
                <AlertDialog
                  isCentered
                  isOpen={isFileDeleteModalOpen}
                  leastDestructiveRef={fileDeleteCancelRef}
                  onClose={onFileDeleteModalClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        画像の削除
                      </AlertDialogHeader>

                      <AlertDialogBody>１件の画像を削除します。よろしいですか？</AlertDialogBody>

                      <AlertDialogFooter>
                        <Button
                          ref={fileDeleteCancelRef}
                          variant="ghost"
                          onClick={onFileDeleteModalClose}
                        >
                          キャンセル
                        </Button>
                        <Button
                          ml={3}
                          colorScheme="red"
                          variant="solid"
                          onClick={() => {
                            onDeleteImage(url)
                              .then(() => {
                                toast({
                                  status: 'success',
                                  title: '画像を削除しました',
                                })
                                onFileDeleteModalClose()
                              })
                              .catch((_e) => {
                                toast({
                                  status: 'error',
                                  title: '画像の削除に失敗しました',
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
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>

      {/* 削除ダイアログ */}
      <AlertDialog
        isCentered
        isOpen={isMessageDeleteModalOpen}
        leastDestructiveRef={messageDeleteCancelRef}
        onClose={onMessageDeleteModalClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              メッセージの削除
            </AlertDialogHeader>

            <AlertDialogBody>
              １件のメッセージを削除します。よろしいですか？
              <Box mt="2" textStyle="label" textAlign="center" textColor="red.400">
                ※ 添付画像もすべて削除されます。
              </Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={messageDeleteCancelRef}
                variant="ghost"
                onClick={onMessageDeleteModalClose}
              >
                キャンセル
              </Button>
              <Button colorScheme="red" variant="solid" onClick={onDelete} ml={3}>
                削除する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
