import type { User } from '@/types/user'

import type { Chat } from '../types'

export const getChatName = ({
  chat,
  membersWithoutMe,
}: {
  chat?: Pick<Chat, 'name'>
  membersWithoutMe?: Pick<User, 'name'>[]
}) => {
  if (chat?.name) return chat.name
  if (membersWithoutMe) return membersWithoutMe.map((member) => member.name).join(', ')

  return ''
}
