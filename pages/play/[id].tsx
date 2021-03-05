import { useRouter } from 'next/router';
import Error from 'next/error';
import { useQuery } from 'react-query';
import { Spinner, Container } from '@chakra-ui/react';

import { GAME_STATES } from '../../utils';
import { JoinGame, WaitingRoom, Play } from '../../components';
import { useUser } from '../../contexts';

const PlayID = (): JSX.Element => {
  const router = useRouter();
  const gameId = Array.isArray(router.query.id) ? undefined : router.query.id;
  const { user } = useUser();

  const { data, isLoading } = useQuery(
    ['game', gameId],
    () => fetch(`/api/game/${gameId}`).then((r) => r.json()),
    {
      refetchInterval: 5000,
    }
  );

  if (data?.state === GAME_STATES.PLAYING) {
    return <Play game={data} />;
  }

  if (!user) {
    return <JoinGame gameId={gameId} />;
  }

  if (data?.state === GAME_STATES.UNSTARTED) {
    return <WaitingRoom game={data} />;
  }

  if (isLoading) {
    return (
      <Container textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" />
      </Container>
    );
  }

  return <Error statusCode={404} />;
};

export default PlayID;
