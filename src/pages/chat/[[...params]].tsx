import {
  Box,
  Flex,
  IconButton,
  Stack,
  StackDivider,
  Text,
  useBoolean,
  useDisclosure,
} from '@chakra-ui/react'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { HiChevronLeft, HiInformationCircle, HiOutlinePencil, HiOutlineX } from 'react-icons/hi'

import { useAuthUser } from '@/auth/hooks'
import { ActiveLink } from '@/components/common/ActiveLink'
import { Avatar } from '@/components/common/Avatar'
import { SkeletonList } from '@/components/common/SkeletonList'
import { ChatHeader } from '@/components/feature/chat/components/ChatHeader'
import { ChatInfoScreen } from '@/components/feature/chat/components/ChatInfoScreen'
import { CreateChatModal } from '@/components/feature/chat/components/CreateChatModal'
import { Empty } from '@/components/feature/chat/components/Empty'
import { InputField } from '@/components/feature/chat/components/InputField'
import { useChats } from '@/components/feature/chat/hooks/useChats'
import { BaseLayout } from '@/components/layout/BaseLayout'
import { pagesPath } from '@/libs/$path'
import { dayjs } from '@/libs/dayjs'

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
  const messageBottomRef = useRef<HTMLDivElement>(null)
  const { authenticatedUser } = useAuthUser()
  const { chats } = useChats(authenticatedUser?.uid)

  console.info(chats)

  return (
    <>
      <Stack
        flex="1"
        direction="row"
        spacing={0}
        // HACK: 画面高を超えさせない
        // overflowY="hidden"
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
            <Flex align="center">
              <Box textStyle="subSubBlockTitle">新規ルーム作成</Box>
              <IconButton
                onClick={onCreateModalOpen}
                ml="auto"
                aria-label="新規メッセージ作成"
                rounded="full"
                colorScheme="blue"
                icon={<HiOutlinePencil />}
              />
            </Flex>
            <Stack as="ul" divider={<StackDivider />}>
              <li>
                <ActiveLink href={`/chat/${chatId}`} rootPath="/chat" passHref>
                  {(isActive) => (
                    <Flex
                      bg={isActive ? 'gray.200' : 'initial'}
                      _hover={{ bg: isActive ? 'gray.200' : 'gray.100' }}
                      as="a"
                      align="center"
                      gridGap="4"
                      rounded="md"
                      p="1"
                    >
                      <Avatar size="sm" name="hoge" />
                      <Stack flex={1}>
                        <Flex align="center">
                          <Text noOfLines={1} fontSize="sm">
                            DMタイトル
                          </Text>
                          <Text as="span" fontSize="xs" textColor="gray.500" ml="auto">
                            {dayjs('2022-01-09T01:29:41.111Z').fromNow()}
                          </Text>
                        </Flex>

                        <Flex align="center" gridGap="1">
                          <Text noOfLines={1} textColor="gray.500" fontSize="xs">
                            最後のメッセージテキストだよ
                          </Text>
                        </Flex>
                      </Stack>
                    </Flex>
                  )}
                </ActiveLink>
              </li>
              <SkeletonList rows={6} rowHeight="14" />
            </Stack>
          </Stack>
        </Box>
        {/* 右カラム */}
        {/* エンプティUI。PC表示時かつチャットを開いていなければ表示 */}
        <Flex direction="column" flex="4" display={{ base: 'none', lg: chatId ? 'none' : 'flex' }}>
          <Empty m="auto" />
        </Flex>
        {/* メッセージエリア。特定のチャットを開いていれば常に表示 */}
        <Flex direction="column" display={chatId ? 'flex' : 'none'} flex="4" gridRowGap="4">
          <ChatHeader
            px={{ lg: 4 }}
            position="sticky"
            top={0}
            zIndex="docked"
            chatTitle={isChatInfoScreen ? '編集中' : 'チャット'}
            back={
              <IconButton
                display={{ lg: 'none' }}
                aria-label="一覧へ戻る"
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
          {isChatInfoScreen ? (
            <ChatInfoScreen px="4" />
          ) : (
            <>
              <Stack overflowY="auto" spacing="4" overscrollBehaviorY="contain" px="4">
                <Box>メッセージ</Box>
                <Box>メッセージ</Box>
                <Box>メッセージ</Box>
                <Box>メッセージ</Box>
                <div id="bottom-of-message" ref={messageBottomRef} />
              </Stack>
              <InputField
                id="chat-file-input"
                mt="auto"
                onSendMessage={async (text, attachmentFileUrls) => {
                  console.info({ text, attachmentFileUrls })
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
        onSubmit={async (text) => console.info(text)}
      />
    </>
  )
}

Page.getLayout = (page: React.ReactElement) => <BaseLayout>{page}</BaseLayout>
export default Page
