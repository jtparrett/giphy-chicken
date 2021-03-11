import {
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Alert,
  Link,
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import NextLink from 'next/link'
import { useState } from 'react'

import { Card } from '../Card'
import { Game } from '../../types'
import { queryClient } from '../../utils'

interface Props {
  game: Game
}

export const WaitingRoom = ({ game }: Props): JSX.Element => {
  const GameLink = `https://giphychicken.com/play/${game.id}`
  const [copyState, setCopyState] = useState(false)

  const { mutate, isLoading } = useMutation(
    () =>
      fetch(`/api/game/${game.id}/start`, {
        method: 'POST',
      }).then((r) => r.json()),
    {
      async onSuccess() {
        await queryClient.refetchQueries(['game', game.id])
      },
    }
  )

  const copyUrl = () => {
    window.navigator.clipboard.writeText(GameLink)
    setCopyState(true)
    setTimeout(() => {
      setCopyState(false)
    }, 3000)
  }

  return (
    <Container py={10} as="main">
      <VStack alignItems="stretch">
        <Alert status="info">
          <Text mr={2}>
            Share this URL to invite people to play:
            <br />
            <Link href={GameLink} target="_blank">
              {GameLink}
            </Link>
          </Text>
          <Button ml="auto" size="xs" colorScheme="blue" onClick={copyUrl}>
            {copyState ? 'Copied URL' : 'Copy URL'}
          </Button>
        </Alert>

        <Card>
          <Heading as="h1" size="md" mb={2}>
            Waiting for players...
          </Heading>
          {game.users.data.map((user) => (
            <Text key={user.id}>{user.name}</Text>
          ))}
        </Card>

        <NextLink href={`/play/${game.id}/how-to`} passHref>
          <Button mt={2} width="full" as="a">
            How to play?
          </Button>
        </NextLink>

        <Button
          colorScheme="blue"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={() => mutate()}
        >
          Start Game
        </Button>
      </VStack>
    </Container>
  )
}
