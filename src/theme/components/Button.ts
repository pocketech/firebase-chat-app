import type { ComponentStyleConfig } from '@chakra-ui/react'

export const Button: ComponentStyleConfig = {
  baseStyle: {
    // HACK: キーボード操作時以外はフォーカスリングを表示しない
    '&:not(:focus-visible)': { boxShadow: 'none' },
  },
}
