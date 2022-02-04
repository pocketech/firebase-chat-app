import { Box, Flex, Stack } from '@chakra-ui/react'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'

import { SkeletonList } from '@/components/common/SkeletonList'
import { Empty } from '@/components/feature/chat/components/Empty'
import { ChatLayout } from '@/components/layout/ChatLayout'

const Page: NextPageWithLayout = () => {
  const { query } = useRouter()
  const params = query.params as string[] | undefined
  const chatId = params?.[0]

  return (
    <Stack
      flex="1"
      direction="row"
      spacing={0}
      // HACK: 画面高を超えさせない
      // overflowY="hidden"
    >
      {/* 左カラム */}
      {/*  チャットリスト。モバイル表示時に特定のチャットを開いていなければ表示 */}
      <Stack
        display={{ base: chatId ? 'none' : 'initial', lg: 'initial' }}
        flex="1"
        borderRightColor="gray.200"
        borderRightWidth="thin"
        // divider={<StackDivider />}
      >
        <SkeletonList rows={6} rowHeight="14" />
      </Stack>
      {/* 右カラム */}
      {/* エンプティUI。PC表示時かつチャットを開いていなければ表示 */}
      <Flex direction="column" flex="4" display={{ base: 'none', lg: chatId ? 'none' : 'flex' }}>
        <Empty m="auto" />
      </Flex>
      {/* メッセージエリア。特定のチャットを開いていれば常に表示 */}
      <Box display={chatId ? 'initial' : 'none'} flex="4" overflowY="auto">
        メッセージエリア
      </Box>
    </Stack>
  )
}

Page.getLayout = (page: React.ReactElement) => <ChatLayout>{page}</ChatLayout>
export default Page
