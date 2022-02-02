// Theme
import type { ChakraTheme } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

// Component style overrides
import { Link } from './components'
// Foundational style overrides
import { sizes, space } from './foundations'
// Global style overrides
import { global } from './global'
// Text style overrides
import { textStyles } from './styles/textStyles'

export const themeOverrides: Partial<ChakraTheme> = {
  sizes,
  space,

  textStyles,
  styles: { global },
  components: {
    Link,
  },
}
export const theme = extendTheme(themeOverrides)
