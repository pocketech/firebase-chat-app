import 'emoji-mart/css/emoji-mart.css'

import { useColorModeValue } from '@chakra-ui/react'
import { Picker } from 'emoji-mart'

export type Props = React.ComponentPropsWithoutRef<typeof Picker>
// TODO:バンドルサイズが大きいためemoji-picker-reactに変える
export const EmojiPicker: React.VFC<Props> = (props) => {
  return (
    <Picker
      theme={useColorModeValue('light', 'dark')}
      title="Pick your emoji…"
      emoji="point_up"
      native
      i18n={{
        search: '検索',
        notfound: '絵文字が見つかりません',
        categories: {
          search: '検索結果',
          recent: 'よく使う絵文字',
          people: '顔 & 人',
          nature: '動物 & 自然',
          foods: '食べ物 & 飲み物',
          activity: 'アクティビティ',
          places: '旅行 & 場所',
          objects: 'オブジェクト',
          symbols: '記号',
          flags: '旗',
        },
      }}
      {...props}
    />
  )
}
