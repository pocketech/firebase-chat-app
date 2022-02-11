import type { User } from '@/types/user'

export type Message = {
  id: string
  createdAt: string
  updatedAt: string
  body: string
  attachmentFileUrls: string[]
  author: User
}

export type Chat = {
  id: string
  createdAt: Date
  updatedAt: Date
  name?: string
  recentMessage?: {
    body: string
  }
  // 自分も含めたユーザIDの配列
  memberIds: string[]
  createdBy: string
}
