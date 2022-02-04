import type { PositionProps } from '@chakra-ui/react'
import { Avatar, Flex, Icon } from '@chakra-ui/react'
import { HiOutlineBell } from 'react-icons/hi'

import { Logo } from '@/components/common/Logo'

import { GUTTER } from '../constants'

type Props = PositionProps

export const Header: React.VFC<Props> = ({ ...positionProps }) => {
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
      <Flex ml="auto" align="center" gridGap="4">
        <Icon as={HiOutlineBell} boxSize="6" color="gray.400" />
        <Avatar size="sm" />
      </Flex>
    </Flex>
  )
}
