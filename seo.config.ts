import type { DefaultSeoProps } from 'next-seo/lib/types'

import { getAbsoluteURL } from '@/utils/getAbsoluteURL'

const OGP_IMAGE_SIZE = {
  width: 1200,
  height: 630,
}

export const config: DefaultSeoProps = {
  title: 'FireChat',
  openGraph: {
    title: 'FireChat',
    description: '思わず熱中しちゃうチャットアプリ',
    type: 'website',
    locale: 'ja_jp',
    images: [
      {
        url: getAbsoluteURL('/og_image.png'),
        width: OGP_IMAGE_SIZE.width,
        height: OGP_IMAGE_SIZE.height,
        alt: 'default og image',
      },
    ],
    url: '/',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    site_name: 'FireChat',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    { name: 'msapplication-TileColor', content: '#2b5797' },
    { name: 'theme-color', content: '#000000' },
  ],
  additionalLinkTags: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'icon', href: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { rel: 'icon', href: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
  ],
}
