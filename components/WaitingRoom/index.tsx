import {
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Alert,
  Link,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';

import { Card } from '../Card';
import { Game } from '../../types';
import { queryClient } from '../../utils';

interface Props {
  game: Game;
}

export const WaitingRoom = ({ game }: Props): JSX.Element => {
  const GameLink = `https://giphy-chicken.vercel.app/play/${game.id}`;

  const { mutate, isLoading } = useMutation(() =>
    fetch(`/api/game/${game.id}/start`, {
      method: 'POST',
    }).then((r) => r.json())
  );

  return (
    <Container py={10} as="main">
      <VStack alignItems="stretch">
        <Alert status="info">
          <Text>
            Share this URL to invite people to play:
            <br />
            <Link href={GameLink} target="_blank">
              {GameLink}
            </Link>
          </Text>
        </Alert>

        <Card>
          <Heading as="h1" size="md" mb={2}>
            Waiting for players...
          </Heading>
          {game.users.data.map((user) => (
            <Text key={user.id}>{user.name}</Text>
          ))}
        </Card>

        <Button
          colorScheme="blue"
          isLoading={isLoading}
          onClick={() => mutate()}
        >
          Start Game
        </Button>
      </VStack>
    </Container>
  );
};