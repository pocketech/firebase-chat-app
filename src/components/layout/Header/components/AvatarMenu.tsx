import { Menu, MenuButton, MenuDivider, MenuItem, MenuList } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { HiOutlineCog, HiOutlineLogout, HiOutlineUserCircle } from 'react-icons/hi'

import { signOut } from '@/auth/api/signOut'
import { Avatar } from '@/components/common/Avatar'
import { pagesPath } from '@/libs/$path'

export const AvatarMenu: React.VFC = () => {
  const { push } = useRouter()
  const onClick = () => {
    signOut().then(() => {
      push(pagesPath.login.$url())
    })
  }

  return (
    <Menu
      placement="bottom-end"
      // TODO: エラー抑制の一時対応。@see https://github.com/chakra-ui/chakra-ui/issues/4328
      id="menu-tmp-avatar"
      isLazy
    >
      <MenuButton aria-label="アカウントメニュー">
        <Avatar size="sm" name="kento" />
      </MenuButton>

      <MenuList>
        <MenuItem
          icon={<HiOutlineUserCircle fontSize="1.6em" color="#999" />}
          onClick={() => push('/')}
        >
          プロフィール
        </MenuItem>
        <MenuItem icon={<HiOutlineCog fontSize="1.6em" color="#999" />} onClick={() => push('/')}>
          アカウント設定
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<HiOutlineLogout fontSize="1.6em" color="#999" />} onClick={onClick}>
          ログアウト
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
