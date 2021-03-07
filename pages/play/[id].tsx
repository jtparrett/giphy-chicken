import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { useQuery } from 'react-query';
import { Spinner, Container } from '@chakra-ui/react';

import { GAME_STATES } from '../../utils';
import { JoinGame, WaitingRoom, Play } from '../../components';
import { GameUserProvider, useGameUser } from '../../contexts';

interface Props {
  gameId: string;
}

const PlayMain = ({ gameId }: Props): JSX.Element => {
  const { userId } = useGameUser();
  const [gameOver, setGameOver] = useState(false);

  const { data, isLoading } = useQuery(
    ['game', gameId],
    () => fetch(`/api/game/${gameId}`).then((r) => r.json()),
    {
      retry: false,
      enabled: !!gameId,
      refetchInterval: gameOver ? false : 5000,
      onSuccess(data) {
        if (data.state === GAME_STATES.FINISHED) {
          setGameOver(true);
        }
      },
    }
  );

  if (isLoading) {
    return (
      <Container textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" />
      </Container>
    );
  }

  if (
    data?.state === GAME_STATES.PLAYING ||
    data?.state === GAME_STATES.FINISHED
  ) {
    return <Play game={data} />;
  }

  if (!userId) {
    return <JoinGame gameId={gameId} />;
  }

  if (data?.state === GAME_STATES.UNSTARTED) {
    return <WaitingRoom game={data} />;
  }

  return <Error statusCode={404} />;
};

const PlayID = (): JSX.Element => {
  const router = useRouter();
  const gameId = Array.isArray(router.query.id) ? undefined : router.query.id;

  return (
    <GameUserProvider gameId={gameId}>
      <PlayMain gameId={gameId} />
    </GameUserProvider>
  );
};

export default PlayID;
