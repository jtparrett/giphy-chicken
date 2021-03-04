import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { useQuery } from 'react-query';
import { Spinner, Container } from '@chakra-ui/react';
import Ably from 'ably/promises';

import { GAME_STATES, queryClient } from '../../utils';
import { JoinGame, WaitingRoom, Play } from '../../components';
import { useUser } from '../../contexts';

const ably = new Ably.Realtime('JZAjwg.3hMZ6w:qSUHBHjOURtVKX5Q');

const PlayID = (): JSX.Element => {
  const router = useRouter();
  const gameId = Array.isArray(router.query.id) ? undefined : router.query.id;
  const { user } = useUser();

  const { data, isLoading } = useQuery(
    ['game', gameId],
    () => fetch(`/api/game/${gameId}`).then((r) => r.json()),
    {
      enabled: !!user,
    }
  );

  const onMessage = ({ data }) => {
    queryClient.setQueryData(['game', gameId], data);
  };

  useEffect(() => {
    const channel = ably.channels.get(gameId);
    channel.subscribe('update', onMessage);

    return () => {
      channel.unsubscribe(onMessage);
    };
  }, [user]);

  if (!user) {
    return <JoinGame gameId={gameId} />;
  }

  if (isLoading) {
    return (
      <Container textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" />
      </Container>
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
