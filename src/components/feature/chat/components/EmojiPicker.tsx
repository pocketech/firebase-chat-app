/* eslint-disable @typescript-eslint/naming-convention */
import type { IEmojiPickerProps } from 'emoji-picker-react'
import dynamic from 'next/dynamic'

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false })

export type Props = IEmojiPickerProps
export const EmojiPicker: React.FC<Props> = (props) => {
  return (
    <Picker
      groupNames={{
        smileys_people: '顔 & 人',
        animals_nature: '動物 & 自然',
        food_drink: '食べ物 & 飲み物',
        travel_places: '旅行 & 場所',
        activities: 'アクティビティ',
        objects: 'オブジェクト',
        symbols: '記号',
        flags: '旗',
        recently_used: 'よく使う絵文字',
      }}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      searchPlaceholder="絵文字を検索"
      {...props}
    />
  )
}
