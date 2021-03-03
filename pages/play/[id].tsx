import { useState } from 'react';
import { Spinner, Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import Error from 'next/error';

import { GAME_STATES } from '../../utils';
import { JoinGame, WaitingRoom, Play } from '../../components';

const PlayID = (): JSX.Element => {
  const router = useRouter();
  const gameId = Array.isArray(router.query.id) ? undefined : router.query.id;
  const [userId, setUserId] = useState(
    () => process.browser && localStorage.getItem('userId')
  );

  const { data, isLoading } = useQuery(
    ['game', gameId],
    () => fetch(`/api/game/${gameId}`).then((r) => r.json()),
    {
      enabled: !!gameId && !!userId,
      retry: false,
      refetchInterval: 5000,
    }
  );

  if (isLoading) {
    return (
      <Container textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Container>
    );
  }

  if (!userId) {
    return (
      <JoinGame
        gameId={gameId}
        onSuccess={(userId) => {
          localStorage.setItem('userId', userId);
          setUserId(userId);
        }}
      />
    );
  }

  if (data?.state === GAME_STATES.UNSTARTED) {
    return <WaitingRoom game={data} />;
  }

  if (data?.state === GAME_STATES.PLAYING) {
    return <Play game={data} />;
  }

  return <Error statusCode={404} />;
};

export default PlayID;
