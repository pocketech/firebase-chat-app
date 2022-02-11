import type { FlexProps } from '@chakra-ui/react'
import { Flex, Stack, Text } from '@chakra-ui/react'

import { Avatar } from '@/components/common/Avatar'
import { dayjs } from '@/libs/dayjs'

import { useChatMembers } from '../hooks/useChatMembers'
import type { Chat } from '../types'

type Props = {
  chat: Chat
  ownId: string
} & FlexProps
export const ChatRow: React.VFC<Props> = ({ chat, ownId, ...flexProps }) => {
  const { members: membersWithoutMe } = useChatMembers(
    chat.memberIds.filter((memberId) => memberId !== ownId)
  )

  const getChatName = () => {
    if (chat.name) return chat.name
    if (membersWithoutMe) return membersWithoutMe.map((member) => member.name).join(', ')

    return '無題'
  }

  return (
    <Flex align="center" gridGap="4" rounded="md" p="1" {...flexProps}>
      <Avatar size="sm" name="hoge" />
      <Stack flex="1">
        <Flex align="center">
          <Text noOfLines={1} fontSize="sm">
            {getChatName()}
          </Text>
          <Text as="span" fontSize="xs" textColor="gray.500" ml="auto">
            {dayjs(chat.recentMessage?.createdAt).fromNow()}
          </Text>
        </Flex>

        <Flex align="center" gridGap="1">
          <Text noOfLines={1} textColor="gray.500" fontSize="xs">
            {chat?.recentMessage?.body}
          </Text>
        </Flex>
      </Stack>
    </Flex>
  )
}
