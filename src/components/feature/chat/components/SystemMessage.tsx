import type { StackProps } from '@chakra-ui/react'
import { Box, Stack } from '@chakra-ui/react'

import { formatDateFromUTC } from '@/libs/dayjs'

import type { SystemMessage as SystemMessageType } from '../types'

type Props = {
  message: Pick<SystemMessageType, 'body' | 'createdAt'>
} & StackProps

export const SystemMessage: React.VFC<Props> = ({ message, ...stackProps }) => {
  return (
    <Stack align="center" w="fit-content" px="4" spacing="0.5" {...stackProps}>
      <Box
        as="time"
        dateTime={formatDateFromUTC(message.createdAt, 'Time')}
        textStyle="captionBase"
      >
        {formatDateFromUTC(message.createdAt, 'Time')}
      </Box>
      <Box textStyle="label">{message.body}</Box>
    </Stack>
  )
}
