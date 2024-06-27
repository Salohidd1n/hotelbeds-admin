import { Box, Button, Heading, Stack } from '@chakra-ui/react';
import FormRow from 'components/FormElements/FormRow';
import FormInput from 'components/FormElements/Input/FormInput';
import useCustomToast from 'hooks/useCustomToast';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../services/auth.service';
import authStore from '../../store/auth.store';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';

const Login = () => {
	const { errorToast } = useCustomToast();
	const form = useForm();

	const { mutate: login, isLoading } = useLoginMutation({
		onSuccess: (res) => {
			console.log(res);
			authStore.login(res);
		},
	});

	const onSubmit = (values) => {
		login({ ...values });
		// authStore.login();
	};

	return (
		<Box padding="65px">
			<Heading as="h1" fontSize="48px" color="#303940">
        Login
			</Heading>

			<Stack
				py={10}
				h="calc(100vh - 200px)"
				spacing={5}
				justifyContent="center"
			>
				<FormRow label="Email">
					<FormInput
						name="user_email"
						inputProps={{
							type: 'email',
						}}
						control={form.control}
						size="lg"
					/>
				</FormRow>
				<FormRow label="Password">
					<FormInput
						name="password"
						control={form.control}
						size="lg"
						type="password"
						inputProps={{
							type: 'password',
						}}
					/>
				</FormRow>

				<Button
					isLoading={isLoading}
					w="full"
					colorScheme="primary"
					size="lg"
					onClick={form.handleSubmit(onSubmit)}
				>
          Login
				</Button>
			</Stack>

			{/* <Stack>
        <Link to="/register">
          <Button
            w="full"
            colorScheme="primary"
            size="lg"
            variant="outlined"
            type="button"
          >
            Sign Up
          </Button>
        </Link>
      </Stack> */}
		</Box>
	);
};

export default Login;
