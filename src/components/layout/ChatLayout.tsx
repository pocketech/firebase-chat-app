import { Global } from '@emotion/react'

import { Header } from './Header'

export const ChatLayout: React.FC = ({ children }) => {
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

      {children}
    </>
  )
}
