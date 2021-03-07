import { Button, Container, VStack, Text } from '@chakra-ui/react';
import Link from 'next/link';

import { Logo, StartGameButton } from '../components';

const Home = (): JSX.Element => (
  <Container maxW="320px" py={10}>
    <Logo />
    <VStack alignItems="stretch">
      <Text textAlign="center">Welcome to Giphy Chicken!</Text>
      <Link href="/how-to" passHref>
        <Button as="a">How to play?</Button>
      </Link>
      <StartGameButton />
    </VStack>
  </Container>
);

export default Home;
