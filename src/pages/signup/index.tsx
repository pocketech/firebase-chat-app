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
import { sendEmailVerification, updateProfile } from 'firebase/auth'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { createUserWithEmailAndPassword } from '@/auth/api/createUserWithEmailAndPassword '
import { useAuthUser } from '@/auth/hooks'
import { Card } from '@/components/common/Card'
import { NextChakraAnchor } from '@/components/common/NextChakraAnchor'
import { PasswordInput } from '@/components/common/PasswordInput'
import { AuthFlowLayout } from '@/components/layout/AuthFlowLayout'
import { pagesPath } from '@/libs/$path'
import type { Schema } from '@/validations/schema/signup-schema'
import { label, schema } from '@/validations/schema/signup-schema'

export type OptionalQuery = {
  email?: string
}

const Page: NextPageWithLayout = () => {
  const {
    replace,
    push,
    query: { email },
  } = useRouter()
  const { authenticatedUser } = useAuthUser()

  // ログイン済(and メール認証済)の場合はトップにリダイレクト
  useEffect(() => {
    if (authenticatedUser?.emailVerified) push(pagesPath.chat._params([]).$url())
  }, [authenticatedUser])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: yupResolver(schema),
    defaultValues: { email: email as string },
  })
  const toast = useToast()
  const onSubmit = handleSubmit(async (data) => {
    try {
      const credential = await createUserWithEmailAndPassword({
        email: data.email,
        password: data.password,
      })

      await updateProfile(credential.user, { displayName: data.displayName })

      await sendEmailVerification(credential.user)
      await replace(pagesPath.signup.confirm.$url())
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use')
        return toast({
          title: 'このメールアドレスは既に登録されています',
          status: 'error',
          isClosable: true,
          duration: null,
        })
      console.error(e)
    }
  })

  return (
    <Flex direction="column" align="center">
      <Box as="h1" textStyle="screenTitle" textColor="gray.50">
        SignUp
      </Box>
      <Box textStyle="label" textColor="gray.300" mt="4">
        Or{' '}
        <NextChakraAnchor
          href={pagesPath.login.$url()}
          _hover={{ textColor: 'cyan.400' }}
          textColor="cyan.300"
        >
          SignIn
        </NextChakraAnchor>
      </Box>
      <Card mt="12" w="full" spacing="6">
        <Stack as="form" noValidate spacing="6" onSubmit={onSubmit}>
          <FormControl id="displayName" isInvalid={Boolean(errors.displayName)}>
            <FormLabel textStyle="label">{label.displayName}</FormLabel>
            <Input type="text" placeholder="チャット太郎" {...register('displayName')} />
            {errors.displayName && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.displayName.message}
              </FormErrorMessage>
            )}
          </FormControl>
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
          <FormControl id="confirmPassword" isInvalid={Boolean(errors.confirmPassword)}>
            <FormLabel textStyle="label">{label.confirmPassword}</FormLabel>
            <PasswordInput {...register('confirmPassword')} />
            {errors.confirmPassword && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.confirmPassword.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
            新規登録
          </Button>
        </Stack>
      </Card>
    </Flex>
  )
}

Page.getLayout = (page: React.ReactElement) => <AuthFlowLayout>{page}</AuthFlowLayout>

export default Page
