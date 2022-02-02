import { Container, Image } from '@chakra-ui/react'

/**
 * サインアップ, ログインのフローで使用するレイアウトパターン。
 */
export const AuthFlowLayout: React.FC = ({ children }) => {
  return (
    <Container as="main" maxW="lg" my="32">
      <Image mx="auto" src="images/logo_symbol.svg" w="16" mb="2" />
      {children}
    </Container>
  )
}
