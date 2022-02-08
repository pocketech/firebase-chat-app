import { Box, chakra, Flex } from '@chakra-ui/react'
import type { NextPageWithLayout } from 'next'

import { NextChakraAnchor } from '@/components/common/NextChakraAnchor'
import { AuthFlowLayout } from '@/components/layout/AuthFlowLayout'

const Page: NextPageWithLayout = () => {
  return (
    <Flex direction="column" justify="center" px={{ base: 4, sm: 6, lg: 8 }} grow={1}>
      <Box py="16">
        <Box textAlign="center">
          <chakra.p
            fontSize="sm"
            fontWeight="semibold"
            color="blue.200"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            404 error
          </chakra.p>
          <chakra.h1
            mt="2"
            fontSize={{ base: '4xl', sm: '5xl' }}
            fontWeight="extrabold"
            color="gray.50"
            letterSpacing="tight"
          >
            Page not found.
          </chakra.h1>
          <chakra.p mt="2" color="gray.100">
            Sorry, we couldn’t find the page you’re looking for.
          </chakra.p>
          <Box mt="6">
            <NextChakraAnchor
              href="/"
              fontSize="medium"
              fontWeight="bold"
              _hover={{ textColor: 'cyan.400' }}
              textColor="cyan.300"
            >
              Go back home<span aria-hidden="true"> &rarr;</span>
            </NextChakraAnchor>
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}

Page.getLayout = (page: React.ReactElement) => <AuthFlowLayout>{page}</AuthFlowLayout>

export default Page
