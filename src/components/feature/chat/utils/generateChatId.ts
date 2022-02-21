import { sha256 } from 'crypto-hash'

/**
 * メンバーの組み合わせによって一意なドキュメントIDを生成
 */
export const generateChatId = async (memberIds: string[]) => {
  const memberIdsJoined = [...memberIds].sort().join('&')
  const chatId = await sha256(memberIdsJoined)

  return chatId
}
