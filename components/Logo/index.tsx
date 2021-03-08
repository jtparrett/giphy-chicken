import { Icon } from '@chakra-ui/react'
import { GiChicken } from 'react-icons/gi'

export const Logo = (): JSX.Element => (
  <Icon w={12} h={12} mx="auto" as={GiChicken} display="block" mb={8} />
)
