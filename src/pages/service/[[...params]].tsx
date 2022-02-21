import {
  Box,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from '@chakra-ui/react'
import type { NextPageWithLayout } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { TABS } from '@/components/feature/service/constants'
import { AboutPanel } from '@/components/feature/service/routes/AboutPanel'
import { ContactPanel } from '@/components/feature/service/routes/ContactPanel'
import { DeletePanel } from '@/components/feature/service/routes/DeletePanel'
import { BaseLayout } from '@/components/layout/BaseLayout'
import { pagesPath } from '@/libs/$path'

const Page: NextPageWithLayout = () => {
  const isLargerThanMd = useBreakpointValue({ md: true })
  const {
    push,
    query: { params },
  } = useRouter()
  // アドレスバー由来のタブインデックス
  const urlTabIndex = TABS.some((tab) => tab.category === params?.[0])
    ? TABS.findIndex((tab) => tab.category === params?.[0])
    : 0

  // タブコンポーネントのタブインデックス
  const [tabIndex, setTabIndex] = useState(urlTabIndex)

  // NOTE: ブラウザバック等の操作時に,URLとタブを同期させるための処理
  useEffect(() => {
    setTabIndex(urlTabIndex)
  }, [urlTabIndex])

  // タブボタンクリック時に発火する処理
  const onChange = (index: number) => {
    // タブが変更されたらrouterへpush。
    push(pagesPath.service._params([TABS[index].category]).$url()), undefined, { shallow: true } // shallowすることでrouterを再度呼び出さない
  }

  return (
    <Stack spacing="8">
      <Box as="h1" textStyle="blockTitle">
        このサービスに関して
      </Box>
      <Tabs
        onChange={onChange}
        colorScheme="blue"
        isFitted={!isLargerThanMd}
        isManual
        isLazy
        lazyBehavior="keepMounted"
        // TODO: エラー抑制の一時対応。@see https://github.com/chakra-ui/chakra-ui/issues/4328
        id="user-tab-tmp"
        index={tabIndex}
      >
        <TabList>
          {TABS.map((tab) => (
            <Tab
              key={tab.category}
              fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
              sx={{ '&:not(:focus-visible)': { boxShadow: 'none' } }}
            >
              {tab.name}
            </Tab>
          ))}
        </TabList>

        <TabPanels mt="8">
          <TabPanel p="unset">
            <AboutPanel />
          </TabPanel>
          <TabPanel p="unset">
            <ContactPanel />
          </TabPanel>
          <TabPanel p="unset">
            <DeletePanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  )
}

Page.getLayout = (page: React.ReactElement) => <BaseLayout hasContainer>{page}</BaseLayout>
export default Page
