/* eslint-disable @typescript-eslint/no-non-null-assertion */
import '../yup-locale'

import type { InferType } from 'yup'
import { object, string } from 'yup'

import { REGEX } from '../regex'

// NOTE: バリデーションとデータの型, フォームのラベルを一元管理するファイル。 @see https://mutantez.netlify.app/articles/2021/04/nextjs-reacthookform-yup-zod
export const schema = object({
  email: string().label('メールアドレス').email().required(),
  password: string()
    .label('パスワード')
    .required()
    .min(8)
    .max(100)
    .matches(
      REGEX.PASSWORD,
      'パスワードは大文字小文字のアルファベットと数字を少なくとも一つ以上含めてください'
    ),
})

// Schema から型を定義する
export type Schema = InferType<typeof schema>

// フォームで使うラベルを export する
export const label: { [P in keyof Schema]-?: string } = {
  email: schema.fields.email.spec.label!,
  password: schema.fields.password.spec.label!,
}
