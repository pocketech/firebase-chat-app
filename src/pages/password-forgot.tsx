import {
  Box,
  Button,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import type { AuthError } from 'firebase/auth'
import { sendPasswordResetEmail } from 'firebase/auth'
import type { NextPageWithLayout } from 'next'
import { useForm } from 'react-hook-form'

import { Card } from '@/components/common/Card'
import { AuthFlowLayout } from '@/components/layout/AuthFlowLayout'
import { auth } from '@/libs/firebase'
import { getAbsoluteURL } from '@/utils/getAbsoluteURL'
import type { Schema } from '@/validations/schema/forgotPassword-schema'
import { label, schema } from '@/validations/schema/forgotPassword-schema'

const Page: NextPageWithLayout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ resolver: yupResolver(schema) })
  const toast = useToast()

  console.info('絶対パス', getAbsoluteURL('/hoge'))

  const onSubmit = handleSubmit((data) => {
    return sendPasswordResetEmail(auth, data.email, {
      // 続行URL
      url: getAbsoluteURL('/login'),
    })
      .then(() =>
        toast({
          status: 'success',
          title: 'パスワード再設定用のリンクを送信しました',
          description: 'メールボックスをご確認ください',
          duration: null,
          isClosable: true,
        })
      )
      .catch((e: AuthError) => {
        if (e.code === 'auth/user-not-found')
          return toast({
            status: 'error',
            title: 'このメールアドレスは存在しません',
          })
        console.error(e)
      })
  })

  return (
    <Card spacing="8">
      <Box as="h1" textStyle="blockTitle">
        パスワードの変更
      </Box>
      <Stack spacing="8" as="form" noValidate onSubmit={onSubmit}>
        <FormControl id="email" isInvalid={Boolean(errors.email)}>
          <FormLabel textStyle="label">{label.email}</FormLabel>
          <Input type="email" placeholder="youremail@example.com" {...register('email')} />
          <FormHelperText>
            パスワードを変更するための認証URLを登録アドレス宛にお送りします。
          </FormHelperText>
          {errors.email && (
            <FormErrorMessage>
              <FormErrorIcon />
              {errors.email.message}
            </FormErrorMessage>
          )}
        </FormControl>
        <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
          認証メールの送信
        </Button>
      </Stack>
    </Card>
  )
}

Page.getLayout = (page: React.ReactElement) => <AuthFlowLayout>{page}</AuthFlowLayout>

export default Page
