import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { applyActionCode } from '@/auth/api/applyActionCode'
import { confirmPasswordReset } from '@/auth/api/confirmPasswordReset'
import { verifyPasswordResetCode } from '@/auth/api/verifyPasswordResetCode'
import { Card } from '@/components/common/Card'
import { PasswordInput } from '@/components/common/PasswordInput'
import { AuthFlowLayout } from '@/components/layout/AuthFlowLayout'
import { pagesPath } from '@/libs/$path'
import type { Schema } from '@/validations/schema/forgotPasswordConfirm-schema'
import { label, schema } from '@/validations/schema/forgotPasswordConfirm-schema'

type Mode = 'resetPassword' | 'verifyEmail'

const Page: NextPageWithLayout = () => {
  const { query, replace, isReady } = useRouter()
  const toast = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ resolver: yupResolver(schema) })
  const [email, setEmail] = useState('')
  const mode = query.mode as Mode | undefined
  const oobCode = query.oobCode as string | undefined
  const continueUrl = query.continueUrl as string | undefined

  useEffect(() => {
    if (!oobCode) return
    if (mode === 'resetPassword') {
      verifyPasswordResetCode(oobCode)
        .then((email) => setEmail(email))
        .catch((e) => {
          if (e.code === 'auth/expired-action-code' || e.code === 'auth/invalid-action-code')
            return toast({
              status: 'error',
              title: 'メールアドレスを再度確認してください',
              description: '確認のリクエストの期限が切れたか、リンクが既に使用されています',
              duration: null,
              isClosable: true,
              position: 'top',
            })
        })
    }

    if (mode === 'verifyEmail') {
      applyActionCode(oobCode)
        .then(() => {
          toast({
            title: 'メールアドレスの認証が完了しました',
            description: '再度ログインしてください',
            status: 'success',
            isClosable: true,
            position: 'top',
          })
          replace(
            pagesPath.login.$url({
              query: {
                path: continueUrl
                  ? `/signup/success?continueUrl=${continueUrl}`
                  : '/signup/success',
              },
            })
          )
        })
        .catch((e) => {
          if (e.code === 'auth/expired-action-code' || e.code === 'auth/invalid-action-code')
            return toast({
              status: 'error',
              title: 'メールアドレスを再度確認してください',
              description: '確認のリクエストの期限が切れたか、リンクが既に使用されています',
              duration: null,
              isClosable: true,
              position: 'top',
            })
        })
    }
  }, [oobCode, mode])

  // クエリパラメータの取得準備が出来ていないときは何も表示しない
  if (!isReady) return null

  if (!mode || !oobCode)
    return (
      <Alert status="error">
        <AlertIcon /> <AlertTitle mr="2">権限がありません</AlertTitle>
      </Alert>
    )

  if (mode === 'verifyEmail') return null

  const onSubmit = handleSubmit((data) => {
    return confirmPasswordReset({ newPassword: data.password, oobCode })
      .then(() => {
        toast({
          status: 'success',
          title: 'パスワードのリセットが成功しました',
        })
        replace(continueUrl ?? pagesPath.login.$url())
      })
      .catch((e) => {
        if (e.code === 'auth/expired-action-code' || e.code === 'auth/invalid-action-code')
          return toast({
            status: 'error',
            title: 'メールアドレスを再度確認してください',
            description: '確認のリクエストの期限が切れたか、リンクが既に使用されています',
            duration: null,
            isClosable: true,
          })
      })
  })

  return (
    <Card spacing="8">
      <Box as="h1" textStyle="blockTitle">
        パスワードの変更 <br />
        <Box as="span" textStyle="label">
          {email}
        </Box>
      </Box>
      <Stack as="form" spacing="8" onSubmit={onSubmit}>
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
          パスワードの更新
        </Button>
      </Stack>
    </Card>
  )
}

Page.getLayout = (page: React.ReactElement) => <AuthFlowLayout>{page}</AuthFlowLayout>

export default Page
