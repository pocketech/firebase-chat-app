import type { FlexProps } from '@chakra-ui/react'
import { SkeletonCircle } from '@chakra-ui/react'
import { Flex, Stack, Text } from '@chakra-ui/react'

import { dayjs } from '@/libs/dayjs'

import { useChatMembers } from '../hooks/useChatMembers'
import type { Chat } from '../types'
import { getChatName } from '../utils/getChatName'
import { ChatIcon } from './ChatIcon'

type Props = {
  chat: Chat
  ownId: string
} & FlexProps
export const ChatRow: React.VFC<Props> = ({ chat, ownId, ...flexProps }) => {
  const { members: membersWithoutMe } = useChatMembers(
    chat.memberIds.filter((memberId) => memberId !== ownId)
  )

  return (
    <Flex align="center" gridGap="4" rounded="md" p="1" {...flexProps}>
      {membersWithoutMe ? (
        <ChatIcon membersWithoutMe={membersWithoutMe} />
      ) : (
        <SkeletonCircle boxSize="12" />
      )}
      <Stack flex="1">
        <Flex align="center">
          <Text noOfLines={1} fontSize="sm">
            {getChatName({ chat, membersWithoutMe })}
          </Text>
          <Text as="span" textStyle="captionSm" textColor="gray.500" ml="auto">
            {chat.recentMessage?.createdAt ? dayjs(chat.recentMessage?.createdAt).fromNow() : ''}
          </Text>
        </Flex>
        <Text noOfLines={1} textColor="gray.500" textStyle="captionBase">
          {chat?.recentMessage?.body}
        </Text>
      </Stack>
    </Flex>
  )
}
