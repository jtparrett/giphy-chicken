import { Box } from '@chakra-ui/react';

export const Logo = (): JSX.Element => (
  <Box w="90px" h="90px" borderRadius="90px" overflow="hidden" mx="auto" mb={8}>
    <Box
      as="img"
      src="https://media.giphy.com/media/f8XJK4RWej0rK/giphy.gif"
      alt="Giphy Chicken"
      height="full"
    />
  </Box>
);
