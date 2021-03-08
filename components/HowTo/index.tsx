import { Text, Heading, VStack, Link } from '@chakra-ui/react'

export const HowTo = (): JSX.Element => (
  <VStack alignItems="stretch">
    <Heading as="h1" size="md">
      How to play Giphy Chicken
    </Heading>

    <Text>
      Originally founded in 2016 by Joseph Kimberger, played on the office slack
      account. Giphy Chicken entails a group of players taking turns to exchange
      one word of a 3 word search term to make the overall term increasingly
      more inappropriate, the term will then reveal a matching Giphy with a
      specified rating. Giphy Chicken has no winners, only a single loser who
      will be titled as such once their term becomes so inappropriate as to
      return an "R" rated Giphy.
    </Text>

    <Text>Giphy Chicken is best played with a group of colleagues.</Text>

    <Text pb={8}>
      This implementation of Giphy Chicken was built by{' '}
      <Link href="https://twitter.com/jpxse_" target="_blank">
        @JPXSE_
      </Link>
    </Text>
  </VStack>
)
