import type { PositionProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Flex, Icon } from '@chakra-ui/react'
import { doc } from 'firebase/firestore'
import NextLink from 'next/link'
import { useDocument } from 'react-firebase-hooks/firestore'
import { HiOutlineBell } from 'react-icons/hi'

import { useAuthUser } from '@/auth/hooks'
import { Logo } from '@/components/common/Logo'
import { pagesPath } from '@/libs/$path'
import { db } from '@/libs/firebase'
import type { User } from '@/types/user'

import { GUTTER } from '../../constants'
import { AvatarMenu } from './AvatarMenu'

type Props = PositionProps

export const Header: React.VFC<Props> = ({ ...positionProps }) => {
  const { authenticatedUser } = useAuthUser()
  const [snapshot] = useDocument(
    authenticatedUser ? doc(db, 'users', authenticatedUser.uid) : undefined
  )
  const user = snapshot?.data() as User | undefined

  return (
    <Flex
      as="header"
      align="center"
      px={{ ...GUTTER }}
      py={{ base: 2, sm: '4' }}
      bgColor="gray.600"
      {...positionProps}
    >
      <Logo width={{ base: '40', lg: '32' }} />
      {user ? (
        <Flex ml="auto" align="center" gridGap="4">
          <Icon as={HiOutlineBell} boxSize="6" color="gray.400" />
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
