import type { AvatarProps } from '@chakra-ui/react'
import { useToken } from '@chakra-ui/react'
import { Avatar as ChakraAvatar, forwardRef } from '@chakra-ui/react'
import BoringAvatar from 'boring-avatars'

type AvatarSize = Exclude<AvatarProps['size'], undefined>

export const AVATAR_DEFAULT_SIZE = 'md'

// NOTE: ChakraAvatarのsizeをBoringAvatarのboxSizeに変換するための連想配列
const AVATAR_SIZE_MAP: { [P in AvatarSize]: number } = {
  '2xs': 16,
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
  full: 128,
}

/**
 * ChakraAvatarのデフォルトアイコンをBoringAvatarにするためのラッパーコンポーネント
 */
export const Avatar = forwardRef<AvatarProps, 'span'>(
  ({ name, src, size = AVATAR_DEFAULT_SIZE, rounded, ...others }, ref) => {
    const [...colors] = useToken('colors', [
      'yellow.100',
      'green.100',
      'orange.100',
      'cyan.100',
      'gray.100',
    ])

    return (
      <ChakraAvatar
        icon={
          <BoringAvatar
            name={name}
            variant="beam"
            size={AVATAR_SIZE_MAP[size]}
            colors={[...colors]}
          />
        }
        bg="gray.100" // for 背景が白い画像の区切り線
        ref={ref}
        size={size}
        name={undefined} // NOTE: Avatar Fallbacksの制御。 @see https://chakra-ui.com/docs/media-and-icons/avatar#avatar-fallbacks
        alt={name}
        src={src}
        rounded={rounded}
        // NOTE: 内部のimg要素にもroundedを適用させる
        sx={{
          img: {
            rounded,
            boxSize: '97%', // for 背景が白い画像の区切り線
          },
        }}
        {...others}
      />
    )
  }
)
