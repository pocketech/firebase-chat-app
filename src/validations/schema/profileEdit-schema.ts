/* eslint-disable @typescript-eslint/no-non-null-assertion */
import '../yup-locale'

import type { InferType } from 'yup'
import { object, string } from 'yup'

// NOTE: バリデーションとデータの型, フォームのラベルを一元管理するファイル。 @see https://mutantez.netlify.app/articles/2021/04/nextjs-reacthookform-yup-zod
export const schema = object({
  profileImageURL: string().label('プロフィール画像').notRequired(),
  displayName: string().label('表示名').required(),
  selfIntroduction: string().label('紹介文').max(50),
})

// Schema から型を定義する
export type Schema = InferType<typeof schema>

// フォームで使うラベルを export する
export const label: { [P in keyof Schema]-?: string } = {
  profileImageURL: schema.fields.profileImageURL.spec.label!,
  displayName: schema.fields.displayName.spec.label!,
  selfIntroduction: schema.fields.selfIntroduction.spec.label!,
}
