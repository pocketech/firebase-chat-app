import 'linkify-plugin-mention'

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
import { HiOutlineDotsVertical } from 'react-icons/hi'

import { Avatar } from '@/components/common/Avatar'
import { formatDateFromUTC } from '@/libs/dayjs'
import styles from '@/styles/Linkify.module.css'

import type { Message as MessageType } from '../types'

type Props = {
  message: MessageType
  isAuthor?: boolean
  onUpdateMessage: (text: string) => Promise<void>
  onDeleteMessage: () => Promise<void>
}

export const Message: React.VFC<Props> = ({
  message,
  isAuthor,
  onUpdateMessage,
  onDeleteMessage,
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
        onClose()
      })
      .catch((_e) => {
        toast({
          status: 'error',
          title: 'メッセージの削除に失敗しました',
        })
      })
  }

  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const onOpen = () => setIsOpen(true)
  const cancelRef = useRef<HTMLButtonElement>(null)

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
                  <Box textStyle="paragraphSm" whiteSpace="pre-wrap">
                    {message.author.selfIntroduction}
                  </Box>
                </Stack>
              </Box>
            </PopoverContent>
          </Popover>
          <Text textStyle="label">{message.author.name}</Text>
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
                <MenuItem onClick={onOpen} color="red.500">
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
              <Flex key={url} maxW={400}>
                <Image src={url} maxH={400} rounded="md" />
              </Flex>
            ))}
          </Flex>
        )}
      </Flex>

      {/* 削除ダイアログ */}
      <AlertDialog isCentered isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              メッセージの削除
            </AlertDialogHeader>

            <AlertDialogBody>１件のメッセージを削除します。よろしいですか？</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} variant="ghost" onClick={onClose}>
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
