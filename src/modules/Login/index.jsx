import { Box, Button, Heading, Stack } from '@chakra-ui/react';
import FormRow from 'components/FormElements/FormRow';
import FormInput from 'components/FormElements/Input/FormInput';
import useCustomToast from 'hooks/useCustomToast';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../services/auth.service';
import authStore from '../../store/auth.store';
import styles from './index.module.scss';

const Login = () => {
	const { errorToast } = useCustomToast();
	const form = useForm();

	const { mutate: login, isLoading } = useLoginMutation({
		onSuccess: (res) => {
			authStore.login(res);
		},
	});

	const onSubmit = (values) => {
		login({ data: values });
		authStore.login();
	};

	return (
		<Box padding="65px">
			<Heading as="h1" fontSize="48px" color="#303940">
        Вход в систему
			</Heading>

			<Stack
				py={10}
				h="calc(100vh - 200px)"
				spacing={5}
				justifyContent="center"
			>
				<FormRow label="Login">
					<FormInput name="login" control={form.control} size="lg" />
				</FormRow>
				<FormRow label="Password">
					<FormInput name="password" control={form.control} size="lg" />
				</FormRow>
			</Stack>

			<Button
				isLoading={isLoading}
				w="full"
				colorScheme="primary"
				size="lg"
				onClick={form.handleSubmit(onSubmit)}
			>
        Войти
			</Button>
		</Box>
	);
};

export default Login;
