import type { As, LayoutProps, SpaceProps } from '@chakra-ui/react'
import { Skeleton, Stack } from '@chakra-ui/react'

type Props = {
  rows?: number
  rowHeight?: LayoutProps['height']
} & SpaceProps & { as?: As<any> }

export const SkeletonList: React.VFC<Props> = ({ rows = 1, rowHeight = 10, ...others }) => {
  return (
    <Stack
      width="100%" // HACK: display: flex 内でも幅いっぱいに表示する
      {...others}
    >
      {[...Array(rows)].map((_, index) => {
        // HACK: ESLint の一時的なエラー回避
        const key = `skelton-${index}`

        return <Skeleton height={rowHeight} key={key} />
      })}
    </Stack>
  )
}
