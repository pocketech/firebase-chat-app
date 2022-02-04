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
  Textarea,
  useToast,
  VisuallyHiddenInput,
  VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import type { NextPageWithLayout } from 'next'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useAuthUser } from '@/auth/hooks'
import { Avatar } from '@/components/common/Avatar'
import { BaseLayout } from '@/components/layout/BaseLayout'
import type { Schema } from '@/validations/schema/profileEdit-schema'
import { label, schema } from '@/validations/schema/profileEdit-schema'

const profileImageAllowedExtentions: `.${string}`[] = ['.jpg', '.jpeg', '.png', '.gif']

const Page: NextPageWithLayout = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ resolver: yupResolver(schema) })
  const { authenticatedUser } = useAuthUser()

  useEffect(() => {
    if (authenticatedUser) {
      reset({
        displayName: authenticatedUser.displayName!,
      })
    }
  }, [authenticatedUser])
  const toast = useToast()
  const onSubmit = handleSubmit((data) => {
    console.info(data)
    toast({
      status: 'success',
    })
  })

  if (!authenticatedUser) return null

  return (
    <Stack spacing="12">
      <Box as="h1" textStyle="blockTitle">
        プロフィール編集
        <br />
        <Box as="span" textStyle="label" textColor="gray.500">
          編集した情報は全体に公開されます
        </Box>
      </Box>
      <Flex as="form" direction={{ base: 'column', lg: 'row' }} gridGap="8" onSubmit={onSubmit}>
        <VStack>
          <VisuallyHiddenInput
            id="fileInput"
            type="file"
            accept={profileImageAllowedExtentions.join(', ')}
          />
          <VisuallyHiddenInput type="text" {...register('profileImage.key')} />
          <Avatar size="xl" name={authenticatedUser.displayName!} />
          <Button as="label" htmlFor="fileInput" size="sm" variant="ghost" textColor="gray.500">
            画像を変更
          </Button>
        </VStack>
        <Stack spacing="8" w="full">
          <FormControl id="displayName" isInvalid={Boolean(errors.displayName)}>
            <FormLabel textStyle="label">{label.displayName}</FormLabel>
            <Input type="text" {...register('displayName')} />
            {errors.displayName && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.displayName.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="selfIntroduction" isInvalid={Boolean(errors.selfIntroduction)}>
            <FormLabel textStyle="label">{label.selfIntroduction}</FormLabel>
            <Textarea {...register('selfIntroduction')} />
            {errors.selfIntroduction && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.selfIntroduction.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <Button
            type="submit"
            alignSelf="center"
            colorScheme="blue"
            w="fit-content"
            isLoading={isSubmitting}
          >
            更新する
          </Button>
        </Stack>
      </Flex>
    </Stack>
  )
}

Page.getLayout = (page: React.ReactElement) => <BaseLayout>{page}</BaseLayout>
export default Page
