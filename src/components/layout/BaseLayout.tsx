import type { LayoutProps } from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'
import { Global } from '@emotion/react'

import { GUTTER } from './constants'
import { Header } from './Header'

type Props = {
  contentWidth?: LayoutProps['maxW']
}

export const BaseLayout: React.FC<Props> = ({ children, contentWidth = 'container.md' }) => {
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

      <Container
        as="main"
        maxW={contentWidth}
        px={{ ...GUTTER, '2xl': 0 }}
        mt="8"
        flex="1"
        mx="auto"
      >
        {children}
      </Container>
    </>
  )
}
