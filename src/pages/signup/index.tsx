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
import { sendEmailVerification } from 'firebase/auth'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { createUserWithEmailAndPassword } from '@/auth/api/createUserWithEmailAndPassword '
import { Card } from '@/components/common/Card'
import { NextChakraAnchor } from '@/components/common/NextChakraAnchor'
import { PasswordInput } from '@/components/common/PasswordInput'
import { AuthFlowLayout } from '@/components/layout/AuthFlowLayout'
import { pagesPath } from '@/libs/$path'
import { getAbsoluteURL } from '@/utils/getAbsoluteURL'
import type { Schema } from '@/validations/schema/signup-schema'
import { label, schema } from '@/validations/schema/signup-schema'

const Page: NextPageWithLayout = () => {
  const toast = useToast()
  const { replace } = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: yupResolver(schema),
  })
  const onSubmit = handleSubmit(async (data) => {
    try {
      const credential = await createUserWithEmailAndPassword({
        email: data.email,
        password: data.password,
      })

      await sendEmailVerification(credential.user, {
        // 続行URL
        url: getAbsoluteURL('/signup/profile'),
      })
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
