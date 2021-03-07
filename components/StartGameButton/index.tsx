import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';

export const StartGameButton = (): JSX.Element => {
  const router = useRouter();

  const { mutate, isLoading } = useMutation(
    () =>
      fetch('/api/create-game', {
        method: 'POST',
      }).then((r) => r.json()),
    {
      onSuccess({ gameId }) {
        router.push(`/play/${gameId}`);
      },
    }
  );

  return (
    <Button onClick={() => mutate()} isLoading={isLoading} colorScheme="blue">
      Start a new game
    </Button>
  );
};
