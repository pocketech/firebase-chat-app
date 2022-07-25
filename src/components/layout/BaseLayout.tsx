import type { LayoutProps } from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'
import { Global } from '@emotion/react'

import { GUTTER } from './constants'
import { Header } from './Header'

type Props = { children: React.ReactNode } & (
  | {
      hasContainer?: false
      containerWidth?: undefined
    } //コンテナがない場合は幅を指定できない
  | {
      hasContainer: true
      containerWidth?: LayoutProps['maxW']
    }
) //コンテナがある場合にのみ幅を指定できる
/**
 * ログイン後に使用するベースとなるレイアウトコンポーネント。
 */
export const BaseLayout: React.FC<Props> = ({
  children,
  containerWidth = 'container.md',
  hasContainer = false,
}) => {
  return (
    <>
      <Global
        styles={{
          body: {
            backgroundColor: 'white',
          },
        }}
      />

      <Header position={{ lg: 'sticky' }} top="0" zIndex="sticky" />

      {hasContainer ? (
        <Container
          as="main"
          maxW={containerWidth}
          px={{ ...GUTTER, '2xl': 0 }}
          mt="8"
          flex="1"
          mx="auto"
        >
          {children}
        </Container>
      ) : (
        children
      )}
    </>
  )
}
