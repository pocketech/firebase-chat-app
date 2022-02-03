import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

import { AuthContextProvider } from '@/auth/context/AuthContextProvider'
import { theme } from '@/theme'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const getLayout: (page: JSX.Element) => JSX.Element =
    (Component as any).getLayout || ((page) => page)

  return (
    <ChakraProvider theme={theme}>
      <AuthContextProvider>{getLayout(<Component {...pageProps} />)}</AuthContextProvider>
    </ChakraProvider>
  )
}

export default MyApp
