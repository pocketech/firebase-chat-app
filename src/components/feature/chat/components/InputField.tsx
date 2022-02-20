import type { SpaceProps } from '@chakra-ui/react'
import { chakra } from '@chakra-ui/react'
import {
  AvatarBadge,
  Box,
  CloseButton,
  Flex,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  useDisclosure,
  useToast,
  VisuallyHiddenInput,
} from '@chakra-ui/react'
import imageCompression from 'browser-image-compression'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import type { ChangeEventHandler } from 'react'
import { useState } from 'react'
import { HiOutlineEmojiHappy, HiOutlinePaperAirplane, HiOutlinePhotograph } from 'react-icons/hi'
import TextareaAutosize from 'react-textarea-autosize'

import { Avatar } from '@/components/common/Avatar'
import { storage } from '@/libs/firebase'
import { removeItemAtIndex } from '@/utils/array'

import { EmojiPicker } from './EmojiPicker'

const AutosizeTextarea = chakra(TextareaAutosize)

const attachmentFileAllowedExtentions: `.${string}`[] = ['.jpg', '.jpeg', '.png', '.gif']

type Props = {
  onSendMessage: (text: string, attachmentFileUrls: string[]) => Promise<void>
} & Pick<SpaceProps, 'mt'> & {
    /**
     * file の input を label で指定するためのもの
     */
    id: string
  }
export const InputField: React.VFC<Props> = ({ onSendMessage, id, ...others }) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const toast = useToast()

  const [text, setText] = useState('')
  const onTextChange: ChangeEventHandler<HTMLTextAreaElement> = (event) =>
    setText(event.target.value)

  const [attachmentFileUrls, setAttachmentFileUrls] = useState<string[]>([])
  const isEmpty = text.length < 1 && attachmentFileUrls.length < 1

  const [previewImages, setPreviewImages] = useState<string[]>([])

  const [isUploading, setIsUploading] = useState(false)

  const reset = () => {
    setText('')
    setPreviewImages([])
    setAttachmentFileUrls([])
  }

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files === null || event.target.files.length === 0) return
    const filesArray = Array.from(event.target.files)

    // プレビュー用URL生成
    filesArray.forEach((file) => {
      const objectUrl = URL.createObjectURL(file)

      setPreviewImages((prev) => [...prev, objectUrl])
    })

    // 画像のアップロード処理
    setIsUploading(true)

    Promise.all(
      filesArray.map(async (file) => {
        // 画像の圧縮処理
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
        })

        console.info(
          `Before ${file.size / 1024 / 1024} MB`,
          `After ${compressedFile.size / 1024 / 1024} MB`
        )

        const storageRef = ref(storage, `/images/chat/${compressedFile.name}`)
        const uploadTask = uploadBytesResumable(storageRef, compressedFile)

        return uploadTask.then((snapshot) => getDownloadURL(snapshot.ref)) as Promise<string>
      })
    )
      .then((urls) => setAttachmentFileUrls((prev) => [...prev, ...urls]))
      .catch((error) => {
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
        setPreviewImages([])
        setAttachmentFileUrls([])
      })
      .finally(() => {
        setIsUploading(false)
        // NOTE: 同一ファイルを選択可能に
        event.target.value = ''
      })
  }

  const onDelete = (index: number) => {
    setPreviewImages((prev) => removeItemAtIndex(prev, index))
    setAttachmentFileUrls((prev) => removeItemAtIndex(prev, index))
  }

  const onSubmit = () => {
    onSendMessage(text, attachmentFileUrls)
      .then(() => {
        reset()
      })
      .catch((_e) => toast({ status: 'error', title: 'メッセージの送信に失敗しました' }))
  }

  return (
    <Box
      position="relative" // for Position of Preview images
      {...others}
    >
      {/* 添付画像のプレビュー */}
      {previewImages.length > 0 && (
        <Flex
          gridGap="8"
          alignItems="center"
          mx={{ base: 2, sm: 4 }}
          // for Position props
          position="absolute"
          bottom="100%"
          mb="3"
        >
          {previewImages.map((image, index) => (
            <Avatar
              // ローディング時にデフォルトアイコンが表示されないように
              icon={<></>}
              key={image}
              src={image}
              name=""
              rounded="md"
            >
              <AvatarBadge boxSize="1.25em" top="-4" right="-2" border="unset">
                <CloseButton
                  color="white"
                  bg="gray.900"
                  rounded="full"
                  size="sm"
                  onClick={() => onDelete(index)}
                  // ホバースタイルを無効化
                  _hover={{}}
                />
              </AvatarBadge>
            </Avatar>
          ))}
          {isUploading && <Spinner colorScheme="blue" />}
        </Flex>
      )}

      {/* 罫線ボックス */}
      <Box
        mx={{ sm: 4 }}
        mb={{ sm: 4 }}
        outline="solid thin"
        outlineColor="gray.300"
        rounded={{ sm: 'md' }}
      >
        <AutosizeTextarea
          cacheMeasurements
          p="2"
          placeholder="テキストを入力"
          resize="none"
          minRows={2}
          w="full"
          value={text}
          onChange={onTextChange}
          _focusVisible={{
            outline: 'none',
          }}
        />

        {/* 下段のボタン群 */}
        <Flex gridGap="1" align="center" p="1" bg="gray.50">
          {/* 絵文字ピッカー */}
          <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            placement="top-start"
            id="emoji-popover"
          >
            <PopoverTrigger>
              <IconButton
                aria-label="絵文字"
                size="sm"
                icon={<HiOutlineEmojiHappy fontSize="1.4rem" />}
                variant="ghost"
                opacity=".5"
                _hover={{ opacity: 1, color: 'yellow.400' }}
                _focus={{ opacity: 1, color: 'yellow.400' }}
                // モバイル時は隠す(モバイルのキーボードが対応しているため)
                display={{ base: 'none', sm: 'inline-flex' }}
              />
            </PopoverTrigger>
            <PopoverContent
              // HACK: キーボード操作時以外はフォーカスリングを表示しない
              sx={{ '&:not(:focus-visible)': { boxShadow: 'none' } }}
            >
              <EmojiPicker
                onSelect={(emoji) => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  setText((prev) => (prev + emoji?.native) as string)
                  onClose()
                }}
              />
            </PopoverContent>
          </Popover>

          {/* 添付ファイル */}
          <VisuallyHiddenInput
            id={id}
            type="file"
            accept={attachmentFileAllowedExtentions.join(', ')}
            multiple
            onChange={onFileChange}
            // HACK: label はフォーカス出来ないため擬似的にフォーカス
            sx={{ '&:focus + label': { opacity: 1, color: 'green.400' } }}
          />
          <IconButton
            as="label"
            htmlFor={id}
            cursor="pointer"
            aria-label="添付ファイル"
            size="sm"
            icon={<HiOutlinePhotograph fontSize="1.4rem" />}
            variant="ghost"
            opacity=".5"
            _hover={{ opacity: 1 }}
          />

          {/* 送信ボタン */}
          <IconButton
            ml="auto"
            transform="rotate(90deg)"
            aria-label="送信"
            isDisabled={isEmpty}
            size="sm"
            icon={<HiOutlinePaperAirplane fontSize="1.4rem" />}
            variant="ghost"
            opacity={isEmpty ? '.5' : '1'}
            color={isEmpty ? 'initial' : 'blue.300'}
            onClick={onSubmit}
            isLoading={isUploading}
          />
        </Flex>
      </Box>
    </Box>
  )
}
