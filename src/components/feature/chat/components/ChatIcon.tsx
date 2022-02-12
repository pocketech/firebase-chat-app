import { Box, Flex } from '@chakra-ui/react'

import { Avatar } from '@/components/common/Avatar'
import type { User } from '@/types/user'

type Props = {
  membersWithoutMe: Pick<User, 'avatarUrl' | 'name'>[]
}
export const ChatIcon: React.VFC<Props> = ({ membersWithoutMe }) => {
  if (membersWithoutMe.length === 1)
    return <Avatar name={membersWithoutMe[0].name} src={membersWithoutMe[0].avatarUrl} />

  if (membersWithoutMe.length === 2)
    return (
      <Flex align="center" overflow="hidden" rounded="full" boxSize="12">
        <Box as="span" w="50%" overflow="hidden">
          <Avatar
            name={membersWithoutMe[0].name}
            src={membersWithoutMe[0].avatarUrl}
            position="relative"
            rounded="unset"
            right="1"
          />
        </Box>
        <Box as="span" w="50%" overflow="hidden">
          <Avatar
            name={membersWithoutMe[1].name}
            src={membersWithoutMe[1].avatarUrl}
            position="relative"
            rounded="unset"
            right="5"
          />
        </Box>
      </Flex>
    )

  if (membersWithoutMe.length === 3)
    return (
      <Flex align="center" overflow="hidden" rounded="full" boxSize="12">
        <Box as="span" w="50%" overflow="hidden">
          <Avatar
            name={membersWithoutMe[0].name}
            src={membersWithoutMe[0].avatarUrl}
            position="relative"
            rounded="unset"
            right="1"
          />
        </Box>
        <Box as="span" w="50%" overflow="hidden">
          <Avatar
            name={membersWithoutMe[1].name}
            src={membersWithoutMe[1].avatarUrl}
            position="relative"
            rounded="unset"
            right="1"
            size="sm"
          />
          <Avatar
            name={membersWithoutMe[2].name}
            src={membersWithoutMe[2].avatarUrl}
            position="relative"
            rounded="unset"
            right="1"
            size="sm"
          />
        </Box>
      </Flex>
    )
  if (membersWithoutMe.length >= 4)
    return (
      <Flex align="center" overflow="hidden" rounded="full" boxSize="12">
        <Box as="span" w="50%" overflow="hidden">
          <Avatar
            name={membersWithoutMe[membersWithoutMe.length - 1].name}
            src={membersWithoutMe[membersWithoutMe.length - 1].avatarUrl}
            position="relative"
            top="2"
            rounded="unset"
            size="sm"
          />
          <Avatar
            name={membersWithoutMe[membersWithoutMe.length - 2].name}
            src={membersWithoutMe[membersWithoutMe.length - 2].avatarUrl}
            position="relative"
            rounded="unset"
            size="sm"
          />
        </Box>
        <Box as="span" w="50%" overflow="hidden">
          <Avatar
            name={membersWithoutMe[membersWithoutMe.length - 3].name}
            src={membersWithoutMe[membersWithoutMe.length - 3].avatarUrl}
            position="relative"
            top="2"
            right="2.5"
            rounded="unset"
            size="sm"
          />
          <Avatar
            name={membersWithoutMe[membersWithoutMe.length - 4].name}
            src={membersWithoutMe[membersWithoutMe.length - 4].avatarUrl}
            position="relative"
            rounded="unset"
            right="1"
            size="sm"
          />
        </Box>
      </Flex>
    )

  return null
}
