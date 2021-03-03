import {
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import * as Yup from 'yup';

interface Props {
  onSuccess: (userId: string) => void;
  gameId: string;
}

interface JoinRes {
  userId: string;
}

interface JoinParams {
  name: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('You must supply a name to play!'),
});

export const JoinGame = ({ gameId, onSuccess }: Props): JSX.Element => {
  const { mutate, isLoading } = useMutation<JoinRes, unknown, JoinParams>(
    ({ name }) =>
      fetch(`/api/game/${gameId}/join`, {
        method: 'POST',
        body: JSON.stringify({ name }),
      }).then((r) => r.json()),
    {
      onSuccess(data) {
        onSuccess(data.userId);
      },
    }
  );

  const formik = useFormik({
    validationSchema,
    initialValues: {
      name: '',
    },
    onSubmit: ({ name }) => {
      mutate({ name });
    },
  });

  return (
    <Container as="main" py={10}>
      <form onSubmit={formik.handleSubmit}>
        <VStack alignItems="stretch">
          <FormControl id="name" isInvalid={!!formik.errors.name}>
            <FormLabel>Choose your name</FormLabel>
            <Input
              placeholder="e.g Jonny Smith..."
              autoFocus
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Join waiting room
          </Button>
        </VStack>
      </form>
    </Container>
  );
};
