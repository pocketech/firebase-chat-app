import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { config } from 'seo.config'

import { AuthContextProvider } from '@/auth/context/AuthContextProvider'
import { theme } from '@/theme'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const getLayout: (page: JSX.Element) => JSX.Element =
    (Component as any).getLayout || ((page) => page)

  return (
    <ChakraProvider theme={theme}>
      <DefaultSeo {...config} />
      <AuthContextProvider>{getLayout(<Component {...pageProps} />)}</AuthContextProvider>
    </ChakraProvider>
  )
}

export default MyApp
