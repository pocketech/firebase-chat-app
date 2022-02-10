import type { LinkProps } from 'next/link'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactElement, VFC } from 'react'

type Props = {
  children: (isActive: boolean) => ReactElement
  /**
   * 渡すhrefの一つが, 他のhrefのサブディレクトリの親になっている場合に, そのhrefを渡す。
   */
  rootPath?: `/${string}`
} & LinkProps
/**
 * パスと連動してアクティブな要素かどうか判断するHeadlessUIコンポーネント。
 * 内部でnext/linkを使用。
 */
export const ActiveLink: VFC<Props> = ({ children, href, rootPath, ...others }) => {
  const { asPath, pathname } = useRouter()
  const checkIsActive = (href: LinkProps['href']): boolean => {
    if (typeof href === 'string')
      return rootPath && href === rootPath ? href === asPath : asPath.startsWith(href)

    return rootPath && href.pathname === rootPath
      ? href.pathname === pathname
      : pathname.startsWith(href.pathname!)
  }

  const isActive = checkIsActive(href)

  return (
    <Link href={href} scroll={false} {...others}>
      {children(isActive)}
    </Link>
  )
}
