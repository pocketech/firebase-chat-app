import type { PositionProps, SpaceProps } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { chakra, Flex } from '@chakra-ui/react'

type Props = {
  chatTitle: string
  /**
   * 設定コンポーネント
   */
  setting: React.ReactElement
  /**
   * 戻るコンポーネント
   */
  back?: React.ReactElement
} & PositionProps &
  SpaceProps

export const ChatHeader: React.VFC<Props> = ({ chatTitle, setting, back, ...others }) => {
  return (
    <Flex align="center" gridGap={{ base: 1, md: 4 }} borderBottomWidth="thin" {...others}>
      {back}

      <chakra.h1
        textStyle="subSubBlockTitle"
        isTruncated
        // HACK: isTruncated を有効に
        width="0"
        flex="1"
      >
        {chatTitle}
      </chakra.h1>

      <Box ml="auto">{setting}</Box>
    </Flex>
  )
}
