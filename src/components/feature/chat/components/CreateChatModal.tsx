import type { ModalProps, UseCheckboxProps } from '@chakra-ui/react'
import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  useCheckbox,
  useCheckboxGroup,
  useToast,
} from '@chakra-ui/react'
import { collection } from 'firebase/firestore'
import { useState } from 'react'
import { useCollectionOnce } from 'react-firebase-hooks/firestore'
import { HiCheckCircle, HiOutlineX } from 'react-icons/hi'

import { Avatar } from '@/components/common/Avatar'
import { db } from '@/libs/firebase'
import type { User } from '@/types/user'

const MemberCheckbox: React.VFC<
  { member: Pick<User, 'name' | 'avatarUrl'> } & UseCheckboxProps
> = ({ member, ...props }) => {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } = useCheckbox(props)

  return (
    <Flex
      as="label"
      align="center"
      gridGap="2"
      rounded="lg"
      px="3"
      py="1"
      cursor="pointer"
      _hover={{ bgColor: 'gray.200' }}
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Flex align="center" gridGap="4">
        <Avatar name={member.name} src={member.avatarUrl} />
        <Box {...getLabelProps()}>{member.name}</Box>
      </Flex>
      <Box ml="auto" rounded="full" boxSize="8" {...getCheckboxProps()}>
        {state.isChecked && <Icon as={HiCheckCircle} boxSize="8" color="green.500" />}
      </Box>
    </Flex>
  )
}

type Props = Omit<ModalProps, 'children'> & {
  onSubmit: (text: string) => Promise<void>
}

export const CreateChatModal: React.VFC<Props> = ({ onSubmit, ...others }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const { value, getCheckboxProps, setValue } = useCheckboxGroup()
  const [snapshot] = useCollectionOnce(collection(db, 'users'))
  const members = snapshot
    ? (snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as User[])
    : undefined

  const onSubmitMessage = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit('hoge')
      toast({
        status: 'success',
        title: 'メッセージを送信しました',
      })
      others.onClose()
    } catch (_e) {
      toast({
        status: 'error',
        title: 'メッセージの送信に失敗しました',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isCentered size="xl" {...others}>
      <ModalOverlay />

      <ModalContent mx="4">
        <ModalHeader textAlign="center" textStyle="subBlockTitle">
          メンバー選択
        </ModalHeader>
        <ModalCloseButton mr="-1" borderRadius="full" onClick={() => setValue([])} />

        <ModalBody>
          <Flex wrap="wrap" mb="4">
            {members &&
              value.map((selectedMemberId) => {
                const selectedMember = members.find((member) => member.id === selectedMemberId)!

                return (
                  <Button
                    key={selectedMemberId}
                    variant="ghost"
                    py="1"
                    px="2"
                    rightIcon={<Icon as={HiOutlineX} boxSize="3" color="gray.600" />}
                    iconSpacing="3"
                    onClick={() =>
                      setValue(value.filter((memberId) => memberId !== selectedMemberId))
                    }
                  >
                    <Flex align="center" gridGap="2">
                      <Avatar size="xs" name={selectedMember.name} src={selectedMember.avatarUrl} />
                      <Box textStyle="label">{selectedMember.name}</Box>
                    </Flex>
                  </Button>
                )
              })}
          </Flex>
          <Stack spacing="4" overflowY="auto" maxH="30vh">
            {members ? (
              members.map((member) => (
                <MemberCheckbox
                  key={member.id}
                  member={member}
                  {...getCheckboxProps({
                    value: member.id,
                  })}
                />
              ))
            ) : (
              <Skeleton />
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={() => {
              others.onClose()
              setValue([])
            }}
          >
            キャンセル
          </Button>
          <Button colorScheme="blue" isLoading={isSubmitting} onClick={onSubmitMessage}>
            招待
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
