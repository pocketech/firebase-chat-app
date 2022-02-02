import type { CSSObject } from '@chakra-ui/react'
import type { GlobalStyleProps } from '@chakra-ui/theme-tools'

// コンテンツの高さを画面高いっぱいまで伸ばすためのもの
const forLayout = {
  html: {
    height: '100%',
  },
  '#__next': {
    display: 'contents',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
  },
}

// propsはカラーモードでスタイルを変えたいときに使用する。
export const global = (_props: GlobalStyleProps): CSSObject => {
  return {
    ...forLayout,
    body: {
      ...forLayout.body,
      textColor: 'gray.900',
      bgColor: 'gray.600',
    },
    li: {
      listStyleType: 'none',
    },
  }
}
