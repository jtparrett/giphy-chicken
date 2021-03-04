import { Button, Container, VStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

import { Logo } from '../components';

const Home = (): JSX.Element => {
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
    <Container maxW="320px" py={10}>
      <Logo />
      <VStack alignItems="stretch">
        <Text textAlign="center">Welcome to Giphy Chicken!</Text>
        <Link href="/how-to" passHref>
          <Button as="a">How to play?</Button>
        </Link>
        <Button
          onClick={() => mutate()}
          isLoading={isLoading}
          colorScheme="blue"
        >
          Start a new game
        </Button>
      </VStack>
    </Container>
  );
};

export default Home;
