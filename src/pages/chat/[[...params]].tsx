import {
  Box,
  Center,
  Flex,
  IconButton,
  Skeleton,
  Spinner,
  Stack,
  StackDivider,
  useBoolean,
  useConst,
  useDisclosure,
} from '@chakra-ui/react'
import { Global } from '@emotion/react'
import { deleteObject, ref } from 'firebase/storage'
import groupBy from 'just-group-by'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useRef } from 'react'
import { HiChevronLeft, HiInformationCircle, HiOutlinePencil, HiOutlineX } from 'react-icons/hi'
import InfiniteScroll from 'react-infinite-scroll-component'

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
import { SystemMessage } from '@/components/feature/chat/components/SystemMessage'
import { useChatMembers } from '@/components/feature/chat/hooks/useChatMembers'
import { useChats } from '@/components/feature/chat/hooks/useChats'
import { useNewerChatMessages } from '@/components/feature/chat/hooks/useNewerChatMessage'
import { useOlderChatMessages } from '@/components/feature/chat/hooks/useOlderChatMessages'
import { getChatName } from '@/components/feature/chat/utils/getChatName'
import { BaseLayout } from '@/components/layout/BaseLayout'
import { useUserOnce } from '@/hooks/useUserOnce'
import { pagesPath } from '@/libs/$path'
import { formatDateFromUTC, formatMessageDividerDate } from '@/libs/dayjs'
import { storage } from '@/libs/firebase'
import { sortAscByCreated } from '@/utils/array'

const Page: NextPageWithLayout = () => {
  const { query, push } = useRouter()
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure()
  const [isChatInfoScreen, setChatInfoScreen] = useBoolean(false)
  const now = useConst(() => new Date())
  const params = query.params as string[] | undefined
  const chatId = params?.[0]

  const {
    messages: olderChatMessages,
    loadMore,
    isReachingEnd,
    isLoadingInitialData,
    mutate,
  } = useOlderChatMessages({
    chatId,
    limit: 10,
    after: now,
  })
  const { messages: newerChatMessages } = useNewerChatMessages({
    chatId,
    after: now,
  })

  const messages = [...sortAscByCreated(olderChatMessages), ...sortAscByCreated(newerChatMessages)]

  console.info(olderChatMessages, 'old')
  const { authenticatedUser } = useAuthUser()

  const { user } = useUserOnce(authenticatedUser?.uid)
  const { chats, isLoading } = useChats(user?.id)
  // 現在のページに基づくChat
  const currentChat = chats?.find((chat) => chat.id === chatId)
  const { members } = useChatMembers(currentChat?.memberIds)
  const membersWithoutMe = members?.filter((member) => member.id !== user?.id)

  const messageBottomRef = useRef<HTMLDivElement>(null)

  // チャットを切り替えたときに最新のメッセージまでスクロールする
  useEffect(() => {
    if (chatId) {
      messageBottomRef.current?.scrollIntoView({
        behavior: 'auto',
        block: 'end',
        inline: 'nearest',
      })
    }
  }, [chatId])

  // TODO: 要UI調整
  if (!user) return null

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
                        <a>
                          <ChatRow
                            chat={chat}
                            ownId={user.id}
                            bg={isActive ? 'gray.200' : 'initial'}
                            _hover={{ bg: isActive ? 'gray.200' : 'gray.100' }}
                          />
                        </a>
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
            bg="white"
            px={{ lg: 4 }}
            position="sticky"
            top={0}
            zIndex={11}
            chatTitle={
              isChatInfoScreen ? 'Chat Info' : getChatName({ chat: currentChat, membersWithoutMe })
            }
            back={
              <IconButton
                display={{ base: 'inline-flex', lg: 'none' }}
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
              overflowY="auto"
              chatId={chatId!}
              userId={user.id}
              chatName={getChatName({ chat: currentChat, membersWithoutMe })}
              chatMembers={members ?? []}
              isAdmin={user.id === currentChat?.createdBy}
            />
          ) : isLoadingInitialData ? (
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
                <Box textAlign="center" mt="4">
                  まだメッセージはありません
                </Box>
              ) : (
                <Flex id="scrollableDiv" direction="column-reverse" overflowY="scroll">
                  <InfiniteScroll
                    scrollableTarget="scrollableDiv"
                    inverse={true}
                    style={{
                      msOverflowStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      scrollbarWidth: 'none',
                    }}
                    dataLength={messages.length}
                    next={() => loadMore()}
                    hasMore={!isReachingEnd}
                    loader={
                      <Center>
                        <Spinner size="lg" speed="0.65s" color="blue.500" thickness="4px" />
                      </Center>
                    }
                  >
                    <Stack spacing="4" px="4">
                      {Object.entries(
                        groupBy(messages, (message) =>
                          formatDateFromUTC(message.createdAt, 'DateHyphen')
                        )
                      )
                        .map(([date, messages]) => ({ date, messages }))
                        .map((group) => (
                          <Fragment key={group.date}>
                            <DividerWithText color="gray.400">
                              {formatMessageDividerDate(group.date)}
                            </DividerWithText>
                            {group.messages.map((message) => {
                              if (message.type === 'system')
                                return (
                                  <SystemMessage
                                    key={message.id}
                                    alignSelf="center"
                                    color="gray.600"
                                    message={message}
                                  />
                                )

                              return (
                                <Message
                                  key={message.id}
                                  message={message}
                                  isAuthor={message.author ? message.author.id === user.id : false}
                                  onUpdateMessage={(text) => {
                                    return updateMessage({
                                      body: text,
                                      chatId: chatId!,
                                      messageId: message.id,
                                    }).then(() => {
                                      mutate()
                                    })
                                  }}
                                  onDeleteMessage={() => {
                                    return deleteMessage({
                                      chatId: chatId!,
                                      messageId: message.id,
                                    }).then(() => {
                                      mutate()
                                    })
                                  }}
                                  onDeleteImage={(url) => {
                                    const imageRef = ref(storage, url)

                                    return deleteObject(imageRef).then(() => {
                                      mutate()
                                    })
                                  }}
                                />
                              )
                            })}
                          </Fragment>
                        ))}
                      <div id="bottom-of-message" ref={messageBottomRef} />
                    </Stack>
                  </InfiniteScroll>
                </Flex>
              )}
              <InputField
                id="chat-file-input"
                mt="auto"
                fileStorageRef={ref(storage, `chat/${chatId!}`)}
                onSendMessage={async (text, attachmentFileUrls) => {
                  return createMessage({
                    chatId: chatId!,
                    body: text,
                    attachmentFileUrls,
                    author: user,
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
        createdBy={user.id}
      />
    </>
  )
}

Page.getLayout = (page: React.ReactElement) => <BaseLayout>{page}</BaseLayout>
export default Page
