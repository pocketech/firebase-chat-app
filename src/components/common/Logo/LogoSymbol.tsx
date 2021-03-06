/* eslint-disable @typescript-eslint/naming-convention */
import type { ColorProps, LayoutProps, SpaceProps } from '@chakra-ui/react'
import { chakra } from '@chakra-ui/react'

type Props = {
  color?: ColorProps['color']
  width?: LayoutProps['width']
} & SpaceProps

export const LogoSymbol: React.VFC<Props> = ({ width = 310, ...others }) => (
  <chakra.figure display="inline-block" m={0} p={0} width={width} {...others}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 1080">
      <g transform="translate(104.16666667 104.16666667) scale(10.41667)">
        <defs>
          <linearGradient id="a">
            <stop offset="0" stopColor="#ee2a7b" />
            <stop offset="1" stopColor="#ff7db8" />
          </linearGradient>
        </defs>
        <rect
          xmlns="http://www.w3.org/2000/svg"
          width="75"
          height="93"
          fill="url(#a)"
          rx="10"
          ry="10"
          transform="scale(.9)"
        />
        <path
          fill="#eee"
          d="M48.44851376 38.81877349c.43640345-.2323409.19830499 13.11885344-.2283157 12.87046268l-15.27666853-4.37104045c-1.03468126 6.3050491-1.79478246 12.70079269-2.23844657 19.17067135-.13763395 1.54231554-6.61190723 2.26596062-7.24090905.71001543-3.36142755-12.70079268-5.59184918-25.89123361-6.5981502-39.3642031-.88243683-1.358379-1.29048553-6.40376852-.24690042-6.91392492 5.44205045-1.66052407 10.99874278-2.9452775 16.6638354-3.9580749 5.675283-.99417445 11.4328534-1.72930919 17.53001854-1.96075842 1.064641-.23802204-2.73408166 21.6915191-3.39951413 21.18327339-3.57351505-1.51225389-7.43529075-2.82299281-11.39540372-3.9725962-.82335804 3.37836908-1.56180466 6.79087596-2.2134801 10.23675637z"
        />
      </g>
    </svg>
  </chakra.figure>
)
