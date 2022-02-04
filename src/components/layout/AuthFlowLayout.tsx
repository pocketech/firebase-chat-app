import { Container } from '@chakra-ui/react'

import { LogoSymbol } from '../common/Logo'

/**
 * サインアップ, ログインのフローで使用するレイアウトパターン。
 */
export const AuthFlowLayout: React.FC = ({ children }) => {
  return (
    <Container as="main" maxW="lg" my="32" textAlign="center">
      <LogoSymbol width="16" mb="2" />
      {children}
    </Container>
  )
}
