import {
  Alert,
  AlertIcon,
  AlertTitle,
  AvatarBadge,
  Box,
  Button,
  CloseButton,
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
import { deleteField, updateDoc } from 'firebase/firestore'
import { doc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import type { NextPageWithLayout } from 'next'
import type { ChangeEventHandler } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { useForm } from 'react-hook-form'

import { useAuthUser } from '@/auth/hooks'
import { Avatar } from '@/components/common/Avatar'
import { BaseLayout } from '@/components/layout/BaseLayout'
import { db, storage } from '@/libs/firebase'
import type { User } from '@/types/user'
import type { Schema } from '@/validations/schema/profileEdit-schema'
import { label, schema } from '@/validations/schema/profileEdit-schema'

const profileImageAllowedExtentions: `.${string}`[] = ['.jpg', '.jpeg', '.png', '.gif']

const Page: NextPageWithLayout = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ resolver: yupResolver(schema) })

  const { authenticatedUser } = useAuthUser()

  const [data, , error] = useDocumentData(
    authenticatedUser ? doc(db, 'users', authenticatedUser.uid) : undefined
  )
  const user = data as User | undefined

  useEffect(() => {
    if (user) {
      console.info({ user })
      reset({
        ...user,
      })
      setPreviewImage(user.avatarUrl ?? '')
    }
  }, [user])
  const toast = useToast()

  const onSubmit = handleSubmit((data) => {
    if (!authenticatedUser) return

    return updateDoc(doc(db, 'users', authenticatedUser.uid), {
      ...data,
      avatarUrl: data.avatarUrl ?? deleteField(),
    })
      .then(() => {
        toast({
          status: 'success',
          title: 'プロフィールを更新しました',
        })
      })
      .catch((e) => console.error(e))
  })

  const [previewImage, setPreviewImage] = useState('')

  const onChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.files === null || event.target.files.length === 0) return
    const files = event.target.files
    const file = files[0]
    // プレビュー用URL生成
    const objectUrl = URL.createObjectURL(file)

    setPreviewImage(objectUrl)

    // 画像のアップロード処理
    const storageRef = ref(storage, `/images/profile/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        console.info(snapshot.bytesTransferred / snapshot.totalBytes)
      },
      (error) => {
        if (error.code === 'storage/unknown')
          return toast({
            status: 'error',
            title: '不明なエラーが発生しました',
            isClosable: true,
            duration: null,
          })
        if (error.code === 'storage/unauthorized')
          return toast({
            status: 'error',
            title: '権限がありません',
            isClosable: true,
            duration: null,
          })
        if (error.code === 'storage/canceled')
          return toast({
            status: 'error',
            title: '操作がキャンセルされました',
            isClosable: true,
            duration: null,
          })
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setValue('avatarUrl', downloadUrl)
        })
      }
    )

    // NOTE: 同一ファイルを選択可能に
    event.target.value = ''
  }
  const onDelete = () => {
    setPreviewImage('')
    setValue('avatarUrl', undefined)
  }

  if (error)
    return (
      <Alert status="error">
        <AlertIcon /> <AlertTitle mr="2">データ取得中に予期せぬエラーが発生しました</AlertTitle>
      </Alert>
    )
  if (!user) return null

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
        <VisuallyHiddenInput
          id="fileInput"
          type="file"
          accept={profileImageAllowedExtentions.join(', ')}
          onChange={onChange}
        />
        <VisuallyHiddenInput type="text" {...register('avatarUrl')} />
        <VStack spacing="4">
          <Avatar size="xl" name={watch('name')} src={previewImage}>
            <AvatarBadge boxSize="1.25em" top="-4" right="-2" border="unset">
              {previewImage && (
                <CloseButton
                  color="white"
                  bg="gray.900"
                  rounded="full"
                  size="sm"
                  onClick={onDelete}
                  // ホバースタイルを無効化
                  _hover={{}}
                />
              )}
            </AvatarBadge>
          </Avatar>
          <Button as="label" htmlFor="fileInput" size="sm" variant="outline" textColor="gray.500">
            アップロード
          </Button>
        </VStack>
        <Stack spacing="8" w="full">
          <FormControl id="name" isInvalid={Boolean(errors.name)}>
            <FormLabel textStyle="label">{label.name}</FormLabel>
            <Input type="text" {...register('name')} />
            {errors.name && (
              <FormErrorMessage>
                <FormErrorIcon />
                {errors.name.message}
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
