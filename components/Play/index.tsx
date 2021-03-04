import {
  Container,
  HStack,
  Text,
  Box,
  Button,
  Icon,
  Input,
  VStack,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';
import { GiChicken } from 'react-icons/gi';
import { useFormik } from 'formik';

import { Game } from '../../types';
import { Card } from '../Card';
import { useMemo } from 'react';
import { useUser } from '../../contexts';

interface Props {
  game: Game;
}

interface TurnParams {
  term: string;
  termIndex: number;
}

export const Play = ({ game }: Props): JSX.Element => {
  const { user } = useUser();
  const entry = game.entries.data[0];
  const term = useMemo(() => {
    return `${entry.term1} ${entry.term2} ${entry.term3}`;
  }, [entry]);

  const { mutate, isLoading } = useMutation<Game, unknown, TurnParams>(
    ({ term, termIndex }) =>
      fetch(`/api/game/${game.id}/turn`, {
        method: 'POST',
        body: JSON.stringify({
          term,
          termIndex,
        }),
      }).then((r) => r.json())
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      term,
    },
    onSubmit({ term }) {
      const terms = term.split(' ');
      const { term1, term2, term3 } = entry;
      const diff = [term1, term2, term3].map((t) => terms.includes(t));
      const diffCount = diff.filter(Boolean).length;

      if (diffCount !== 2) {
        formik.setFieldError('term', 'One word must be changed.');
        return;
      }

      const index = diff.indexOf(false);

      mutate({
        termIndex: index + 1,
        term: terms[index],
      });
    },
  });

  return (
    <Container py={10} maxW="720px">
      <HStack alignItems="flex-start" spacing={6}>
        <Box flex="1">
          {user.id === game.turnUser.id && (
            <form onSubmit={formik.handleSubmit}>
              <Text fontWeight="bold" mb={2}>
                It's your turn! change a word!!
              </Text>
              <HStack>
                <FormControl id="term" isInvalid={!!formik.errors.term}>
                  <Input
                    name="term"
                    onChange={formik.handleChange}
                    value={formik.values.term}
                  />
                  <FormErrorMessage>{formik.errors.term}</FormErrorMessage>
                </FormControl>
                <Button type="submit" isLoading={isLoading}>
                  Submit
                </Button>
              </HStack>
            </form>
          )}
          <VStack pt={8} alignItems="flex-start">
            {game.entries.data?.map(
              (entry) =>
                entry.giphyId && (
                  <Box key={entry.id}>
                    <Text>
                      {entry.term1} {entry.term2} {entry.term3}
                    </Text>
                    <Box
                      as="img"
                      maxW="full"
                      src={`https://media.giphy.com/media/${entry.giphyId}/giphy.gif`}
                    />
                  </Box>
                )
            )}
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
