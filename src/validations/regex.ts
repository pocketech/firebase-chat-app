/* eslint-disable @typescript-eslint/naming-convention */

/**
 * バリデーション用の正規表現
 */
export const REGEX = {
  KATAKANA: /^[ァ-ヶー]+$/,
  TEL: /^0\d{1,4}-?\d{1,4}-?\d{3,4}$/,
  // 「大文字小文字のアルファベットと数字を少なくとも一つを含む8から100文字」
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)[A-Za-z\d]{8,100}$/,
  REGEX_ZIPCODE: /^\d{7}$/,
  REGEX_CORPORATENUMBER: /^\d{13}$/,
}
