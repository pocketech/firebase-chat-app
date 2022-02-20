import type { User } from '@/types/user'

type MessageBase = {
  id: string
  createdAt: Date
  updatedAt: Date
  body: string
}
export type SystemMessage = MessageBase & { type: 'system' }
export type UserMessage = MessageBase & {
  type: 'user'
  attachmentFileUrls: string[]
  // 該当者がチャットを退会した場合はundefinedとなる
  author?: User
}
export type Message = SystemMessage | UserMessage

export type Chat = {
  id: string
  createdAt: Date
  updatedAt: Date
  name?: string
  recentMessage?: {
    body: string
    createdAt: Date
  }
  // 自分も含めたユーザIDの配列
  memberIds: string[]
  createdBy: string
}
