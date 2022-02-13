import { Box, Stack } from '@chakra-ui/react'
import type { NextPageWithLayout } from 'next'

import { BaseLayout } from '@/components/layout/BaseLayout'

const Page: NextPageWithLayout = () => {
  return (
    <Stack spacing="12">
      <Box as="h1" textStyle="blockTitle">
        アカウントページ
        <br />
        <Box as="span" textStyle="label" textColor="gray.500">
          編集した情報は全体に公開されます
        </Box>
      </Box>
    </Stack>
  )
}

Page.getLayout = (page: React.ReactElement) => <BaseLayout hasContainer>{page}</BaseLayout>
export default Page
