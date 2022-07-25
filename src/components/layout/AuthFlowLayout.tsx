import { Container } from '@chakra-ui/react'

import { LogoSymbol } from '../common/Logo'

type Props = {
  children: React.ReactNode
}

/**
 * サインアップ, ログインのフローで使用するレイアウトパターン。
 */
export const AuthFlowLayout: React.FC<Props> = ({ children }) => {
  return (
    <Container as="main" maxW="lg" mt="32" textAlign="center">
      <LogoSymbol width="16" mb="2" />
      {children}
    </Container>
  )
}
