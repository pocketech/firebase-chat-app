import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import type { AuthError } from 'firebase/auth'
import { sendEmailVerification } from 'firebase/auth'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { signIn } from '@/auth/api'
import { Card } from '@/components/common/Card'
import { DividerWithText } from '@/components/common/DividerWithText'
import { NextChakraAnchor } from '@/components/common/NextChakraAnchor'
import { PasswordInput } from '@/components/common/PasswordInput'
import { GoogleIcon } from '@/components/feature/auth/components/GoogleIcon'
import { AuthFlowLayout } from '@/components/layout/AuthFlowLayout'
import { pagesPath } from '@/libs/$path'
import type { Schema } from '@/validations/schema/login-scheme'
import { label, schema } from '@/validations/schema/login-scheme'

export type OptionalQuery = {
  path?: string
  email?: string
}

const Page: NextPageWithLayout = () => {
  const {
    query: { email },
    push,
  } = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ resolver: yupResolver(schema), defaultValues: { email: email as string } })
  const toast = useToast()

  const onSubmit = handleSubmit((data) => {
    return signIn({ email: data.email, password: data.password })
      .then((credential) => {
        if (!credential.user.emailVerified) {
          sendEmailVerification(credential.user)

          return toast({
            title: 'メール認証が完了しておりません',
            description: '登録されたメールアドレスに認証URLを再送しました',
            duration: null,
            status: 'error',
            isClosable: true,
          })
        }
        toast({
          title: 'ログインに成功しました。',
          description: 'FireChatへようこそ！',
          status: 'success',
          isClosable: true,
        })
        push('/')
      })
      .catch((e: AuthError) => {
        if (e.code === 'auth/wrong-password')
          return toast({
            title: 'パスワードが間違っています',
            status: 'error',
            isClosable: true,
            duration: null,
          })
        if (e.code === 'auth/user-not-found')
          return toast({
            title: 'このメールアドレスは登録されていません',
            status: 'error',
            isClosable: true,
            duration: null,
          })
        if (e.code === 'auth/too-many-requests')
          return toast({
            title: 'ログインが制限されています',
            description: 'しばらく経ってから再度お試しください',
            status: 'error',
            isClosable: true,
            duration: null,
          })
        console.error(e)
      })
  })

  return (
    <Flex direction="column" align="center">
      <Box as="h1" textStyle="screenTitle" textColor="gray.50">
        Sign in to your account
      </Box>
      <Box textStyle="label" textColor="gray.300" mt="4">
        Or{' '}
        <NextChakraAnchor
          href={pagesPath.signup.$url()}
          _hover={{ textColor: 'cyan.400' }}
          textColor="cyan.300"
        >
          SignUp
        </NextChakraAnchor>
      </Box>
      <Card mt="12" w="full" spacing="6">
        <Stack as="form" noValidate spacing="6" onSubmit={onSubmit}>
          <FormControl id="email" isInvalid={Boolean(errors.email)}>
            <FormLabel textStyle="label">{label.email}</FormLabel>
            <Input type="email" placeholder="youremail@example.com" {...register('email')} />
            {errors.email && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.email.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="password" isInvalid={Boolean(errors.password)}>
            <FormLabel textStyle="label">{label.password}</FormLabel>
            <PasswordInput {...register('password')} />
            {errors.password && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.password.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <NextChakraAnchor href={pagesPath.password_forgot.$url()}>
            パスワードを忘れた場合
          </NextChakraAnchor>
          <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
            ログイン
          </Button>
        </Stack>
        <DividerWithText color="gray.500">Or continue with</DividerWithText>
        <Button>
          <GoogleIcon boxSize="8" position="absolute" left={2} />
          Google
        </Button>
      </Card>
    </Flex>
  )
}

Page.getLayout = (page: React.ReactElement) => <AuthFlowLayout>{page}</AuthFlowLayout>
export default Page
