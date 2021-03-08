import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'

interface Props {
  children?: ReactNode
}

export const Card = ({ children }: Props): JSX.Element => (
  <Box
    borderWidth="1px"
    borderColor="gray.300"
    borderStyle="solid"
    borderRadius="md"
    p={4}
  >
    {children}
  </Box>
)
