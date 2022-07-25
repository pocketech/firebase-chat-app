import type { FlexProps } from '@chakra-ui/react'
import { Box, Flex } from '@chakra-ui/react'

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
} & FlexProps

export const ChatHeader: React.VFC<Props> = ({ chatTitle, setting, back, ...others }) => {
  return (
    <Flex align="center" gridGap={{ base: 1, md: 4 }} borderBottomWidth="thin" {...others}>
      {back}

      <Box as="h1" textStyle="subSubBlockTitle">
        {chatTitle}
      </Box>

      <Box ml="auto">{setting}</Box>
    </Flex>
  )
}
