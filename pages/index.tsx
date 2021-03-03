import { Button, Container, Icon, VStack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { GiChicken } from 'react-icons/gi';

const Home = (): JSX.Element => (
  <Container maxW="320px" py={10}>
    <Icon as={GiChicken} w={10} h={10} display="block" mx="auto" my={8} />
    <VStack alignItems="stretch">
      <Text textAlign="center">Welcome to Giphy Chicken!</Text>
      <Link href="/how-to" passHref>
        <Button as="a">How to play?</Button>
      </Link>
      <Link href="/create-game" passHref>
        <Button as="a" colorScheme="blue">
          Start a new game
        </Button>
      </Link>
    </VStack>
  </Container>
);

export default Home;
