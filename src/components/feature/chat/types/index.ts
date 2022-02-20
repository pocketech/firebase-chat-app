import type { User } from '@/types/user'

export type Message = {
  id: string
  createdAt: Date
  updatedAt: Date
  body: string
  attachmentFileUrls: string[]
  // 該当者がチャットを退会した場合はundefinedとなる
  author?: User
}

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
