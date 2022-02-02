import type { InputProps } from '@chakra-ui/react'
import {
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useBoolean,
} from '@chakra-ui/react'
import { forwardRef } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'

type Props = InputProps

// eslint-disable-next-line react/display-name
export const PasswordInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const [isShow, setShow] = useBoolean(false)

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={isShow ? 'text' : 'password'}
        placeholder="パスワードを入力してください"
        ref={ref}
        {...props}
      />
      <InputRightElement width="4.5rem">
        <IconButton
          variant="unstyled"
          aria-label="パスワード表示/非表示"
          onClick={setShow.toggle}
          icon={<Icon as={isShow ? HiEyeOff : HiEye} color="gray.500" boxSize="5" />}
        />
      </InputRightElement>
    </InputGroup>
  )
})
