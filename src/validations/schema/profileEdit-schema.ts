/* eslint-disable @typescript-eslint/no-non-null-assertion */
import '../yup-locale'

import type { InferType, SchemaOf } from 'yup'
import { object, string } from 'yup'

import type { User } from '@/types/user'

// NOTE: バリデーションとデータの型, フォームのラベルを一元管理するファイル。 @see https://mutantez.netlify.app/articles/2021/04/nextjs-reacthookform-yup-zod
export const schema: SchemaOf<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> = object({
  name: string().label('表示名').required(),
  avatarUrl: string().label('プロフィール画像').notRequired(),
  selfIntroduction: string().label('紹介文').max(50).notRequired(),
})

// Schema から型を定義する
export type Schema = InferType<typeof schema>

// フォームで使うラベルを export する
export const label: { [P in keyof Schema]-?: string } = {
  avatarUrl: schema.fields.avatarUrl.spec.label!,
  name: schema.fields.name.spec.label!,
  selfIntroduction: schema.fields.selfIntroduction.spec.label!,
}
