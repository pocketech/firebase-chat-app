import type { PositionProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import { doc } from 'firebase/firestore'
import NextLink from 'next/link'
import { useDocumentData } from 'react-firebase-hooks/firestore'

import { useAuthUser } from '@/auth/hooks'
import { Logo } from '@/components/common/Logo'
import { pagesPath } from '@/libs/$path'
import { db } from '@/libs/firebase'
import type { User } from '@/types/user'

import { GUTTER } from '../../constants'
import { AvatarMenu } from './AvatarMenu'
import { NotificationMenu } from './NotificationMenu'

type Props = PositionProps

export const Header: React.VFC<Props> = ({ ...positionProps }) => {
  const { authenticatedUser } = useAuthUser()
  const [data] = useDocumentData(
    authenticatedUser ? doc(db, 'users', authenticatedUser.uid) : undefined
  )
  const user = data as User | undefined

  return (
    <Flex
      as="header"
      align="center"
      px={{ ...GUTTER }}
      py={{ base: 2, sm: '4' }}
      bgColor="gray.600"
      {...positionProps}
    >
      <NextLink href={pagesPath.chat._params([]).$url()}>
        <a>
          <Logo width={{ base: '40', lg: '32' }} />
        </a>
      </NextLink>
      {user ? (
        <Flex ml="auto" align="center" gridGap="4">
          <NotificationMenu />
          <AvatarMenu name={user.name} avatarUrl={user.avatarUrl} />
        </Flex>
      ) : (
        <NextLink href={pagesPath.signup.$url()} passHref>
          <Button as="a" colorScheme="blue" ml="auto">
            新規登録
          </Button>
        </NextLink>
      )}
    </Flex>
  )
}
