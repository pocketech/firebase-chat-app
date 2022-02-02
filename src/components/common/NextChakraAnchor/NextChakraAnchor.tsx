import type { LinkProps as ChakraLinkProps } from '@chakra-ui/react'
import { Link as ChakraLink } from '@chakra-ui/react'
import type { LinkProps as NextLinkProps } from 'next/dist/client/link'
import NextLink from 'next/link'
import type { PropsWithChildren } from 'react'

export type NextChakraAnchorProps = PropsWithChildren<
  NextLinkProps & Omit<ChakraLinkProps, 'as' | 'href'>
>

/**
 * ChakraUI の Link のスタイルを維持しつつ、Next.js の Link の機能を兼ね備えたコンポーネント。aタグを内部で使用している。
 * @see https://github.com/chakra-ui/chakra-ui/blob/main/examples/nextjs-typescript/components/NextChakraLink.tsx
 */
export const NextChakraAnchor = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch = false,
  children,
  ...chakraProps
}: NextChakraAnchorProps) => {
  return (
    <NextLink
      passHref
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
    >
      <ChakraLink {...chakraProps}>{children}</ChakraLink>
    </NextLink>
  )
}
