import type { ComponentSingleStyleConfig } from '@chakra-ui/react'

export const Link: ComponentSingleStyleConfig = {
  baseStyle: {
    // HACK: キーボード操作時以外はフォーカスリングを表示しない
    '&:not(:focus-visible)': { boxShadow: 'none' },
    color: 'blue.300',
    _hover: {
      textDecoration: 'none',
      color: 'blue.500',
    },
  },
}
