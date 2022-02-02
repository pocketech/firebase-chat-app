import type { StackProps } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { VisuallyHidden } from '@chakra-ui/react'
import { IconButton, InputGroup, InputRightElement } from '@chakra-ui/react'
import {
  Box,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useForm } from 'react-hook-form'
import { HiArrowRight } from 'react-icons/hi'

import { DividerWithText } from '@/components/common/DividerWithText'
import { pagesPath } from '@/libs/$path'
import { auth } from '@/libs/firebase'
import type { Schema } from '@/validations/schema/loginOrSignup-schema'
import { label, schema } from '@/validations/schema/loginOrSignup-schema'

import { checkIfUserExists } from '../../../../auth/api/checkIfUserExists'
import { GoogleIcon } from './GoogleIcon'

type Props = StackProps

export const AuthJudgeBox: React.VFC<Props> = ({ ...others }) => {
  const [signInWithGoogle, user, isLoading] = useSignInWithGoogle(auth)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: yupResolver(schema) })
  const { push } = useRouter()
  const onSubmit = handleSubmit((data) => {
    checkIfUserExists(data.email)
      .then((isUserExists) => {
        if (isUserExists) return push(pagesPath.login.$url({ query: { email: data.email } }))

        push(pagesPath.signup.$url())
      })
      .catch((e) => console.error(e))
  })

  useEffect(() => {
    if (user) {
      push('/')
    }
  }, [user])

  return (
    <Box {...others}>
      <Box as="h1" textStyle="screenTitle" textColor="gray.50" mb="12">
        ログイン{` `}
        <Box as="span" textStyle="sectionTitle">
          または
        </Box>
        {` `}
        新規登録
      </Box>
      <Stack spacing="4">
        <Stack onSubmit={onSubmit} as="form" noValidate spacing="10">
          <FormControl id="email" isInvalid={Boolean(errors.email)}>
            <VisuallyHidden>
              <FormLabel textStyle="label">{label.email}</FormLabel>
            </VisuallyHidden>
            <InputGroup>
              <Input
                textColor="gray.50"
                type="email"
                {...register('email')}
                placeholder="youremail@example.com"
              />
              <InputRightElement>
                <IconButton
                  // TODO: xlサイズを追加するまでのアドホック対応
                  minW="14"
                  h="14"
                  rounded="full"
                  size="lg"
                  type="submit"
                  colorScheme="blue"
                  aria-label="next step"
                  icon={<HiArrowRight fontSize="24" />}
                />
              </InputRightElement>
            </InputGroup>
            {errors.email && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.email.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </Stack>
        <DividerWithText color="gray.50">Or continue with</DividerWithText>
        <Button isLoading={isLoading} onClick={() => signInWithGoogle()}>
          <GoogleIcon boxSize="8" position="absolute" left={2} />
          Google
        </Button>
      </Stack>
    </Box>
  )
}
