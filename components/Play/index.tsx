import {
  Container,
  HStack,
  Stack,
  Text,
  Box,
  Button,
  Icon,
  Input,
  VStack,
  FormControl,
  FormErrorMessage,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useMutation } from 'react-query';
import { GiChicken } from 'react-icons/gi';
import { useFormik } from 'formik';

import { Game } from '../../types';
import { Card } from '../Card';
import { useMemo } from 'react';
import { useGameUser } from '../../contexts';
import { GAME_STATES, queryClient } from '../../utils';

interface Props {
  game: Game;
}

interface TurnParams {
  term: string;
  termIndex: number;
}

export const Play = ({ game }: Props): JSX.Element => {
  const { userId } = useGameUser();
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
      }).then((r) => r.json()),
    {
      async onSuccess() {
        await queryClient.refetchQueries(['game', game.id]);
      },
    }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      term,
    },
    onSubmit({ term }) {
      const terms = term.split(' ');
      const { term1, term2, term3 } = entry;
      const diff = [term1, term2, term3].map((t, i) => t !== terms[i]);
      const diffCount = diff.filter(Boolean).length;

      if (diffCount !== 1) {
        formik.setFieldError('term', 'One word must be changed.');
        return;
      }

      const index = diff.indexOf(true);

      mutate({
        termIndex: index + 1,
        term: terms[index],
      });
    },
  });

  return (
    <Container py={10} maxW="720px">
      <Stack direction={{ base: 'column', md: 'row-reverse' }} spacing={0}>
        <Box w="200px" ml={{ base: 0, md: 4 }} mb={4}>
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
        <Box flex="1">
          {game.state === GAME_STATES.FINISHED && (
            <Alert status="error">
              <AlertTitle>GAME OVER!!!!!!</AlertTitle>
            </Alert>
          )}

          {game.state === GAME_STATES.PLAYING && (
            <>
              {userId ? (
                <>
                  {userId === game.turnUser.id ? (
                    <form onSubmit={formik.handleSubmit}>
                      <Text fontWeight="bold" mb={2}>
                        You're up, change one word...
                      </Text>
                      <HStack>
                        <FormControl id="term" isInvalid={!!formik.errors.term}>
                          <Input
                            name="term"
                            onChange={formik.handleChange}
                            value={formik.values.term}
                          />
                          <FormErrorMessage>
                            {formik.errors.term}
                          </FormErrorMessage>
                        </FormControl>
                        <Button type="submit" isLoading={isLoading}>
                          Submit
                        </Button>
                      </HStack>
                    </form>
                  ) : (
                    <Alert status="warning">
                      <AlertTitle>It's not your turn just yet...</AlertTitle>
                    </Alert>
                  )}
                </>
              ) : (
                <Alert status="warning">
                  <AlertTitle>Game already in progress</AlertTitle>
                  <AlertDescription>
                    Feel free to stay and spectate...
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}

          <VStack pt={4} alignItems="flex-start">
            {game.entries.data?.map((entry) => (
              <Box
                key={entry.id}
                p={2}
                borderRadius="md"
                backgroundColor={
                  entry.giphyRating === 'r' ? 'red.500' : 'gray.100'
                }
              >
                <Text>
                  {entry.term1} {entry.term2} {entry.term3}
                </Text>
                <Box
                  as="img"
                  maxW="full"
                  src={`https://media.giphy.com/media/${entry.giphyId}/giphy.gif`}
                />
              </Box>
            ))}
          </VStack>
        </Box>
      </Stack>
    </Container>
  );
};
