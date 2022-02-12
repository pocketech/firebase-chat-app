import {
  Box,
  Flex,
  IconButton,
  Skeleton,
  Stack,
  StackDivider,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react'
import { Global } from '@emotion/react'
import groupBy from 'just-group-by'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useRef } from 'react'
import { HiChevronLeft, HiInformationCircle, HiOutlinePencil, HiOutlineX } from 'react-icons/hi'

import { useAuthUser } from '@/auth/hooks'
import { ActiveLink } from '@/components/common/ActiveLink'
import { DividerWithText } from '@/components/common/DividerWithText'
import { createMessage } from '@/components/feature/chat/api/createMessage'
import { deleteMessage } from '@/components/feature/chat/api/deleteMessage'
import { updateMessage } from '@/components/feature/chat/api/updateMessage'
import { ChatHeader } from '@/components/feature/chat/components/ChatHeader'
import { ChatInfoScreen } from '@/components/feature/chat/components/ChatInfoScreen'
import { ChatRow } from '@/components/feature/chat/components/ChatRow'
import { CreateChatModal } from '@/components/feature/chat/components/CreateChatModal'
import { Empty } from '@/components/feature/chat/components/Empty'
import { InputField } from '@/components/feature/chat/components/InputField'
import { Message } from '@/components/feature/chat/components/Message'
import { useChatMembers } from '@/components/feature/chat/hooks/useChatMembers'
import { useChatMessages } from '@/components/feature/chat/hooks/useChatMessages'
import { useChats } from '@/components/feature/chat/hooks/useChats'
import { getChatName } from '@/components/feature/chat/utils/getChatName'
import { BaseLayout } from '@/components/layout/BaseLayout'
import { pagesPath } from '@/libs/$path'
import { formatDateFromUTC, formatMessageDividerDate } from '@/libs/dayjs'
import { sortAscByCreated } from '@/utils/array'

const Page: NextPageWithLayout = () => {
  const { query, push } = useRouter()
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure()
  const [isChatInfoScreen, setChatInfoScreen] = useBoolean(false)
  const params = query.params as string[] | undefined
  const chatId = params?.[0]
  const { messages, isLoading: isMessagesLoading } = useChatMessages(chatId)
  const { authenticatedUser } = useAuthUser()
  const { chats, isLoading } = useChats(authenticatedUser?.uid)
  // 現在のページに基づくChat
  const currentChat = chats?.find((chat) => chat.id === chatId)
  const { members } = useChatMembers(currentChat?.memberIds)
  const membersWithoutMe = members?.filter((member) => member.id !== authenticatedUser?.uid)

  const messageBottomRef = useRef<HTMLDivElement>(null)

  // チャットを切り替えたときに最新のメッセージまでスクロールする
  useEffect(() => {
    if (!isMessagesLoading && chatId) {
      messageBottomRef.current?.scrollIntoView({
        behavior: 'auto',
        block: 'end',
        inline: 'nearest',
      })
    }
  }, [chatId, isMessagesLoading])

  // TODO: 要UI調整
  if (!authenticatedUser) return null

  return (
    <>
      <Global
        styles={{
          body: {
            height: '100%', //右カラムのみスクロールさせる
          },
        }}
      />
      <Stack
        flex="1"
        direction="row"
        spacing={0}
        overflowY="hidden" // 右カラムのみスクロールさせる
      >
        {/* 左カラム */}
        {/*  チャットリスト。モバイル表示時に特定のチャットを開いていなければ表示 */}
        <Box
          display={{ base: chatId ? 'none' : 'initial', lg: 'initial' }}
          flex="1"
          p="2"
          borderRightColor="gray.200"
          borderRightWidth="thin"
        >
          <Stack spacing="8">
            <Flex position="relative" align="center" justify="center">
              <Box textStyle="subSubBlockTitle">チャット ({chats?.length ?? 0})</Box>
              <IconButton
                position="absolute"
                right="0"
                size="sm"
                onClick={onCreateModalOpen}
                aria-label="新規チャット作成"
                rounded="full"
                colorScheme="blue"
                icon={<HiOutlinePencil />}
              />
            </Flex>
            <Stack as="ul" divider={<StackDivider />}>
              {isLoading || !chats ? (
                [...Array(4)].map((_, index) => {
                  // HACK: ESLint の一時的なエラー回避
                  const key = `skelton-${index}`

                  return <Skeleton as="li" height="14" key={key} />
                })
              ) : chats.length === 0 ? (
                <Box as="li">まだチャットはありません</Box>
              ) : (
                chats.map((chat) => (
                  <li key={chat.id}>
                    <ActiveLink href={`/chat/${chat.id}`} rootPath="/chat" passHref>
                      {(isActive) => (
                        <ChatRow
                          as="a"
                          chat={chat}
                          ownId={authenticatedUser.uid}
                          bg={isActive ? 'gray.200' : 'initial'}
                          _hover={{ bg: isActive ? 'gray.200' : 'gray.100' }}
                        />
                      )}
                    </ActiveLink>
                  </li>
                ))
              )}
            </Stack>
          </Stack>
        </Box>
        {/* 右カラム */}
        {/* エンプティUI。PC表示時かつチャットを開いていなければ表示 */}
        <Flex direction="column" flex="4" display={{ base: 'none', lg: chatId ? 'none' : 'flex' }}>
          <Empty m="auto" />
        </Flex>
        {/* メッセージエリア。特定のチャットを開いていれば常に表示 */}
        <Flex direction="column" display={chatId ? 'flex' : 'none'} flex="4">
          <ChatHeader
            px={{ lg: 4 }}
            position="sticky"
            top={0}
            zIndex="docked"
            chatTitle={
              isChatInfoScreen ? 'Chat Info' : getChatName({ chat: currentChat, membersWithoutMe })
            }
            back={
              <IconButton
                display={{ lg: 'none' }}
                aria-label="チャット一覧へ戻る"
                size="lg"
                icon={<HiChevronLeft />}
                variant="ghost"
                onClick={() => push(pagesPath.chat._params([]).$url())}
              />
            }
            setting={
              isChatInfoScreen ? (
                <IconButton
                  onClick={setChatInfoScreen.off}
                  aria-label="閉じる"
                  size="lg"
                  rounded="full"
                  color="gray.500"
                  icon={<HiOutlineX fontSize="1.4em" />}
                  variant="ghost"
                />
              ) : (
                <IconButton
                  onClick={setChatInfoScreen.on}
                  aria-label="設定"
                  size="lg"
                  rounded="full"
                  color="blue.300"
                  icon={<HiInformationCircle fontSize="1.4em" />}
                  variant="ghost"
                />
              )
            }
          />
          {/* ボディ */}
          {isChatInfoScreen ? (
            <ChatInfoScreen
              px="4"
              mt="4"
              chatId={chatId!}
              chatName={getChatName({ chat: currentChat, membersWithoutMe })}
              chatMembers={members ?? []}
            />
          ) : !messages || isMessagesLoading ? (
            <Stack px="4" spacing="4">
              {[...Array(6)].map((_, index) => {
                // HACK: ESLint の一時的なエラー回避
                const key = `skelton-${index}`

                return <Skeleton as="li" height="14" key={key} />
              })}
            </Stack>
          ) : (
            <>
              {messages.length === 0 ? (
                <Box textAlign="center">まだメッセージはありません</Box>
              ) : (
                <Stack overflowY="auto" spacing="4" overscrollBehaviorY="contain" px="4">
                  {Object.entries(
                    groupBy(sortAscByCreated(messages), (message) =>
                      formatDateFromUTC(message.createdAt, 'DateHyphen')
                    )
                  )
                    .map(([date, messages]) => ({ date, messages }))
                    .map((group) => (
                      <Fragment key={group.date}>
                        <DividerWithText color="gray.400">
                          {formatMessageDividerDate(group.date)}
                        </DividerWithText>
                        {group.messages.map((message) => (
                          <Message
                            key={message.id}
                            message={message}
                            isAuthor={message.author.id === authenticatedUser.uid}
                            onUpdateMessage={(text) => {
                              return updateMessage({
                                body: text,
                                chatId: chatId!,
                                messageId: message.id,
                              })
                            }}
                            onDeleteMessage={() => {
                              return deleteMessage({ chatId: chatId!, messageId: message.id })
                            }}
                          />
                        ))}
                      </Fragment>
                    ))}
                  <div id="bottom-of-message" ref={messageBottomRef} />
                </Stack>
              )}
              <InputField
                id="chat-file-input"
                mt="auto"
                onSendMessage={async (text, attachmentFileUrls) => {
                  return createMessage({
                    chatId: chatId!,
                    body: text,
                    attachmentFileUrls,
                    author: {
                      avatarUrl: authenticatedUser.photoURL ?? undefined,
                      id: authenticatedUser.uid,
                      name: authenticatedUser.displayName!,
                    },
                  }).then((reference) => {
                    if (reference)
                      messageBottomRef.current?.scrollIntoView({
                        behavior: 'auto',
                        block: 'end',
                        inline: 'nearest',
                      })
                  })
                }}
              />
            </>
          )}
        </Flex>
      </Stack>
      {/* チャット作成モーダル */}
      <CreateChatModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        createdBy={authenticatedUser.uid}
      />
    </>
  )
}

Page.getLayout = (page: React.ReactElement) => <BaseLayout>{page}</BaseLayout>
export default Page
