import type { SpaceProps, StackProps } from '@chakra-ui/react'
import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Stack,
  useEditableControls,
} from '@chakra-ui/react'

import { Avatar } from '@/components/common/Avatar'

const EditableControls: React.VFC<SpaceProps> = ({ ...others }) => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
    useEditableControls()

  return isEditing ? (
    <ButtonGroup size="sm" spacing="4" {...others}>
      <Button variant="outline" {...getCancelButtonProps()}>
        キャンセル
      </Button>
      <Button colorScheme="blue" {...getSubmitButtonProps()}>
        更新
      </Button>
    </ButtonGroup>
  ) : (
    <Button size="sm" variant="ghost" colorScheme="blue" {...others} {...getEditButtonProps()}>
      編集
    </Button>
  )
}

type Props = StackProps
export const ChatInfoScreen: React.VFC<Props> = ({ ...stackProps }) => {
  return (
    <Stack spacing="8" {...stackProps}>
      <Stack spacing="4">
        <Box textColor="gray.500" flex="1" textStyle="label">
          チャット名
        </Box>
        <Editable
          d="flex"
          alignItems="center"
          defaultValue={'デフォルト'}
          onSubmit={(value) => console.info(value)}
        >
          <EditablePreview />
          <EditableInput
            mr="8"
            onKeyDown={(e) => {
              // 日本語変換時に送信されないように
              if (e.keyCode === 229) e.preventDefault()
            }}
          />
          <EditableControls ml="auto" />
        </Editable>
      </Stack>
      <Stack spacing="4">
        <Box textColor="gray.500" flex="1" textStyle="label">
          メンバー
        </Box>
        <Flex align="center" gridGap="4">
          <Avatar name={'ほげほげ'} />
          <Box>ほげほげ</Box>
        </Flex>
      </Stack>
    </Stack>
  )
}
