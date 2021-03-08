import {
  Text,
  Heading,
  Container,
  VStack,
  Button,
  Link,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

import { HowTo } from '../../../components'

const PlayHowTo = (): JSX.Element => {
  const router = useRouter()
  const gameId = Array.isArray(router.query.id) ? undefined : router.query.id

  return (
    <Container as="main" py={10} maxW="400px">
      <HowTo />

      <NextLink href={`/play/${gameId}`} passHref>
        <Button as="a" leftIcon={<FiArrowLeft />} width="full">
          Return to game
        </Button>
      </NextLink>
    </Container>
  )
}

export default PlayHowTo
