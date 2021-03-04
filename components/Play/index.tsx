import { Container, HStack, Text, Box, Button } from '@chakra-ui/react';
import { useMutation } from 'react-query';

import { Game } from '../../types';
import { Card } from '../Card';

interface Props {
  game: Game;
  userId: string;
}

export const Play = ({ game, userId }: Props): JSX.Element => {
  const { mutate } = useMutation(() =>
    fetch(`/api/game/${game.id}/turn`, {
      method: 'POST',
      body: JSON.stringify({ term: 'wow', termIndex: 1 }),
    }).then((r) => r.json())
  );

  return (
    <Container py={10} maxW="720px">
      <HStack alignItems="flex-start">
        <Box flex="1">
          {game.entries.data?.map((entry) => (
            <Text key={entry.id}>
              {entry.term1} {entry.term2} {entry.term3}
            </Text>
          ))}

          {userId === game.turnUser.id && (
            <Button onClick={() => mutate()}>Submit</Button>
          )}
        </Box>
        <Box w="200px" position="sticky" top={4}>
          <Card>
            {game.users.data?.map((user) => (
              <Text key={user.id}>{user.name}</Text>
            ))}
          </Card>
        </Box>
      </HStack>
    </Container>
  );
};
