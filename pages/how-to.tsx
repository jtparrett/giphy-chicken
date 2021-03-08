import { Container, Button } from '@chakra-ui/react'
import NextLink from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

import { StartGameButton, HowTo } from '../components'

const HowToPage = (): JSX.Element => (
  <Container as="main" py={10} maxW="400px">
    <HowTo />

    <StartGameButton />

    <NextLink href="/" passHref>
      <Button as="a" leftIcon={<FiArrowLeft />} width="full" mt={2}>
        Return home
      </Button>
    </NextLink>
  </Container>
)

export default HowToPage
