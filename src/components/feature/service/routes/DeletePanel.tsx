import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Stack,
  useToast,
} from '@chakra-ui/react'
import { deleteUser } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'

import { useAuthUser } from '@/auth/hooks'
import { pagesPath } from '@/libs/$path'

export const DeletePanel: React.VFC = () => {
  const { push } = useRouter()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAccountDeleteModalOpen, setIsAccountDeleteModalOpen] = useState(false)
  const onAccountDeleteModalClose = () => setIsAccountDeleteModalOpen(false)
  const onAccountDeleteModalOpen = () => setIsAccountDeleteModalOpen(true)
  const accountDeleteCancelRef = useRef<HTMLButtonElement>(null)
  const { authenticatedUser } = useAuthUser()

  if (!authenticatedUser) return null

  return (
    <>
      <Stack>
        <Box>サービスを退会してアカウントを削除します</Box>

        <Box alignSelf="end">
          <Button
            size="sm"
            colorScheme="red"
            w="fit-content"
            variant="outline"
            onClick={onAccountDeleteModalOpen}
          >
            サービスの退会
          </Button>
        </Box>
      </Stack>
      {/* チャット退出ダイアログ */}
      <AlertDialog
        isCentered
        isOpen={isAccountDeleteModalOpen}
        leastDestructiveRef={accountDeleteCancelRef}
        onClose={onAccountDeleteModalClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              サービスの退会
            </AlertDialogHeader>

            <AlertDialogBody>
              このサービスから退会します。本当によろしいですか？
              <Box mt="2" textStyle="label" textAlign="center" textColor="red.400">
                ※ アカウントは削除されますが投稿したメッセージは削除されません
              </Box>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={accountDeleteCancelRef}
                variant="ghost"
                onClick={onAccountDeleteModalClose}
              >
                キャンセル
              </Button>
              <Button
                ml={3}
                isLoading={isSubmitting}
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  setIsSubmitting(true)
                  deleteUser(authenticatedUser)
                    .then(() => {
                      toast({
                        status: 'success',
                        title: 'アカウントを削除しました',
                      })
                      onAccountDeleteModalClose()
                      push(pagesPath.$url())
                    })
                    .catch((e) => {
                      console.error(e)
                      toast({
                        status: 'error',
                        title: 'アカウントの削除に失敗しました',
                      })
                    })
                    .finally(() => {
                      setIsSubmitting(false)
                    })
                }}
              >
                退会してアカウントを削除する
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
