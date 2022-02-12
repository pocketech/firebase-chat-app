import { Box, Icon, IconButton, Menu, MenuButton, MenuList } from '@chakra-ui/react'
import { HiOutlineBell } from 'react-icons/hi'

export const NotificationMenu: React.VFC = () => {
  return (
    <Menu
      placement="bottom-end"
      // TODO: エラー抑制の一時対応。@see https://github.com/chakra-ui/chakra-ui/issues/4328
      id="menu-tmp-notification"
      isLazy
    >
      <MenuButton
        as={IconButton}
        aria-label="通知"
        variant="ghost"
        borderRadius="full"
        minWidth="8"
        height="8"
        icon={<Icon as={HiOutlineBell} w="6" h="6" color="gray.400" />}
      />

      <MenuList maxH="60vh" overflowY="auto" overscrollBehaviorY="contain">
        <Box mx="2" textStyle="subBlockTitle" mb="4">
          通知
        </Box>
        <Box mx="2" textStyle="label" color="gray.500">
          まだ通知はありません
        </Box>
      </MenuList>
    </Menu>
  )
}
