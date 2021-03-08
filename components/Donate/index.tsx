import { Box, Button, Text } from '@chakra-ui/react';
import { Card } from '../Card';

export const Donate = (): JSX.Element => (
  <Box mt={2}>
    <Card>
      <Text fontSize="xs" mb={2}>
        Donate to keep GiphyChicken alive
      </Text>
      <form
        action="https://www.paypal.com/donate"
        method="post"
        target="_blank"
      >
        <input type="hidden" name="business" value="NZXEQUSU443VQ" />
        <input type="hidden" name="currency_code" value="GBP" />
        <Button type="submit" size="sm" width="full">
          Donate with PayPal
        </Button>
      </form>
    </Card>
  </Box>
);
