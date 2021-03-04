import {
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  VStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('You must supply a name to play!'),
});

interface CreateRes {
  userId: string;
  gameId: string;
}

interface CreateParams {
  name: string;
}

const CreateGame = (): JSX.Element => {
  const router = useRouter();

  const { mutate, isLoading } = useMutation<CreateRes, unknown, CreateParams>(
    ({ name }) =>
      fetch('/api/create-game', {
        method: 'POST',
        body: JSON.stringify({ name }),
      }).then((r) => r.json()),
    {
      onSuccess: (data) => {
        localStorage.setItem('userId', data.userId);
        router.push(`/play/${data.gameId}`);
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
    <Container as="main" py={10} maxW="380px">
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

export default CreateGame;
