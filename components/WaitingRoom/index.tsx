import {
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Alert,
  Link,
  Box,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';

interface User {
  name: string;
  id: string;
}

interface Props {
  game: {
    id: string;
    turn: number;
    users: {
      data: User[];
    };
  };
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

        <Box
          p={6}
          borderWidth="1px"
          borderColor="gray.300"
          borderStyle="solid"
          borderRadius="md"
        >
          <Heading as="h1" size="md" mb={2}>
            Waiting for players...
          </Heading>
          {game.users.data.map((user) => (
            <Text key={user.id}>{user.name}</Text>
          ))}
        </Box>

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
