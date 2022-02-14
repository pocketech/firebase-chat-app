import type { TypographyProps } from '@chakra-ui/react'

/**
 * テキストに関するデザイントークン
 * SmartHRのHeadingコンポーネントを参照
 * @see https://smarthr.design/products/components/heading/
 */
export const textStyles: Record<string, TypographyProps> = {
  screenTitle: {
    fontSize: { base: '3xl', sm: '4xl' },
    fontWeight: { base: 'semibold', sm: 'extrabold' },
    lineHeight: { base: '9', sm: '10' },
  },
  sectionTitle: {
    fontSize: { base: '2xl', sm: '3xl' },
    fontWeight: 'semibold',
    lineHeight: { base: '8', sm: '9' },
  },
  blockTitle: {
    fontSize: { base: 'xl', sm: '2xl' },
    fontWeight: 'semibold',
    lineHeight: { base: '7', sm: '8' },
  },
  subBlockTitle: {
    fontSize: { base: 'lg', sm: 'xl' },
    fontWeight: 'semibold',
    lineHeight: '7',
  },
  subSubBlockTitle: {
    fontSize: { base: 'md', sm: 'lg' },
    fontWeight: 'semibold',
    lineHeight: '7',
  },
  paragraphBase: {
    fontSize: { base: 'md', sm: 'lg' },
    fontWeight: 'normal',
    lineHeight: { base: '7', sm: '8' },
  },
  paragraphSm: {
    fontSize: { base: 'sm', sm: 'md' },
    fontWeight: 'normal',
    lineHeight: { base: '5', sm: '6' },
  },
  body: {
    fontSize: 'md',
    fontWeight: 'normal',
    lineHeight: '6',
  },
  label: {
    fontSize: 'sm',
    fontWeight: 'medium',
    lineHeight: '5',
  },
  captionBase: {
    fontSize: 'xs',
    fontWeight: 'normal',
    lineHeight: '4',
  },
  captionSm: {
    fontSize: 'xx-small',
    fontWeight: 'normal',
    lineHeight: '3',
  },
}
