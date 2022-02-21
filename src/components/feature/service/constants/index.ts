import type { Category } from '../types'

export const DEFAULT_TAB_CATEGORY: Category = 'about'

export const TABS: { name: string; category: Category }[] = [
  { name: 'About', category: 'about' },
  { name: 'お問い合わせ', category: 'contact' },
  { name: '退会', category: 'delete' },
]
