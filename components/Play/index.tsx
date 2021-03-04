import {
  Container,
  HStack,
  Text,
  Box,
  Button,
  Icon,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';
import { GiChicken } from 'react-icons/gi';
import { useFormik } from 'formik';

import { Game } from '../../types';
import { queryClient } from '../../utils';
import { Card } from '../Card';
import { useMemo } from 'react';

interface Props {
  game: Game;
  userId: string;
}

export const Play = ({ game, userId }: Props): JSX.Element => {
  const entry = game.entries.data[0];
  const term = useMemo(() => {
    return `${entry.term1} ${entry.term2} ${entry.term3}`;
  }, [entry]);

  const { mutate, isLoading } = useMutation(
    () =>
      fetch(`/api/game/${game.id}/turn`, {
        method: 'POST',
        body: JSON.stringify({ term: 'wow', termIndex: 1 }),
      }).then((r) => r.json()),
    {
      onSuccess() {
        queryClient.refetchQueries(['game', game.id]);
      },
    }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      term,
    },
    onSubmit({ term }) {
      const [term1, term2, term3] = term.split(' ');
      console.log(term1, term2, term3);
    },
  });

  return (
    <Container py={10} maxW="720px">
      <HStack alignItems="flex-start" spacing={6}>
        <Box flex="1">
          {userId === game.turnUser.id && (
            <form onSubmit={formik.handleSubmit}>
              <Text fontWeight="bold" mb={2}>
                It's your turn! change a word!!
              </Text>
              <HStack>
                <Input
                  name="term"
                  onChange={formik.handleChange}
                  value={formik.values.term}
                />
                <Button type="submit" isLoading={isLoading}>
                  Submit
                </Button>
              </HStack>
            </form>
          )}
          <VStack pt={8} alignItems="flex-start">
            {game.entries.data?.map((entry) => (
              <Text key={entry.id}>
                {entry.term1} {entry.term2} {entry.term3}
              </Text>
            ))}
          </VStack>
        </Box>
        <Box w="200px" position="sticky" top={4}>
          <Card>
            {game.users.data?.map((user) => {
              const isTurn = user.id === game.turnUser.id;
              return (
                <Text
                  key={user.id}
                  color={isTurn ? 'blue.500' : 'gray.500'}
                  fontWeight={isTurn ? 'bold' : 'normal'}
                >
                  {isTurn && <Icon as={GiChicken} mr={1} />}
                  {user.name}
                </Text>
              );
            })}
          </Card>
        </Box>
      </HStack>
    </Container>
  );
};
