import type { NextComponentType, NextPageContext } from 'next'
import type { ReactElement, ReactNode } from 'react'

// NOTE: NextPageの型を拡張
declare module 'next' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  type NextPageWithLayout<P = {}, IP = P> = NextComponentType<NextPageContext, IP, P> & {
    getLayout: (page: ReactElement) => ReactNode
  }
}
