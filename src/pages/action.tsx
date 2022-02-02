import {
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
import { useForm } from 'react-hook-form'

import { applyActionCode } from '@/auth/api/applyActionCode'
import { Card } from '@/components/common/Card'
import { PasswordInput } from '@/components/common/PasswordInput'
import { AuthFlowLayout } from '@/components/layout/AuthFlowLayout'
import type { Schema } from '@/validations/schema/forgotPasswordConfirm-schema'
import { label, schema } from '@/validations/schema/forgotPasswordConfirm-schema'

type Mode = 'resetPassword' | 'verifyEmail'

const Page: NextPageWithLayout = () => {
  const { query, replace } = useRouter()
  const toast = useToast()
  const {
    register,
    // handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ resolver: yupResolver(schema) })

  // if (!query.mode || !query.oobCode) return null

  const mode = query.mode as Mode
  const oobCode = query.oobCode as string
  // const continueUrl = (query.continueUrl as string | undefined) ?? '/home'

  if (mode === 'verifyEmail') {
    applyActionCode(oobCode).then(() => {
      toast({
        title: 'メールアドレスの認証が完了しました',
        description: '5秒後にリダイレクトします',
        status: 'success',
        isClosable: true,
      })
      setTimeout(() => replace('/profile'), 5000)
    })
  }

  return (
    <Card spacing="8">
      <Box as="h1" textStyle="blockTitle">
        パスワードの変更
      </Box>
      <Stack as="form" spacing="8">
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
