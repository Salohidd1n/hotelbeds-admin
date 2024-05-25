import { Button, Heading } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import FormRow from '../../../components/FormElements/FormRow';
import FormInput from '../../../components/FormElements/Input/FormInput';
import FormNumberInput from '../../../components/FormElements/Input/FormNumberInput';
import Header, {
	HeaderExtraSide,
	HeaderLeftSide,
	HeaderTitle,
} from '../../../components/Header';
import SimpleLoader from '../../../components/Loaders/SimpleLoader';
import NotificationMenu from '../../../components/NotificationMenu';
import { Page } from '../../../components/Page';
import PageCard, {
	PageCardFooter,
	PageCardForm,
	PageCardHeader,
} from '../../../components/PageCard';
import ProfileMenu from '../../../components/ProfileMenu';
import useCustomToast from '../../../hooks/useCustomToast';
import {
	useUserCreateMutation,
	useUserGetByIdQuery,
	useUserUpdateMutation,
} from '../../../services/user.service';

const UserDetail = () => {
	const navigate = useNavigate();
	const { userId } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			user_type: 1,
		},
	});

	const { isLoading } = useUserGetByIdQuery({
		id: userId,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(userId),
			onSuccess: reset,
		},
	});

	const { mutate: createUser, isLoading: createLoading } =
    useUserCreateMutation({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });
	const { mutate: updateUser, isLoading: updateLoading } =
    useUserUpdateMutation({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	const onSubmit = (values) => {
		const createData = {
			first_name: values.first_name,
			last_name: values.last_name,
			pinfl: values.pinfl,
			user_type: 1,
		};

		const updateData = {
			first_name: values.first_name,
			last_name: values.last_name,
			pinfl: Number(values.pinfl),
		};

		if (!userId) createUser(createData);
		else {
			updateUser({
				id: userId,
				data: updateData,
			});
		}
	};

	if (isLoading) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Пользователи</HeaderTitle>
				</HeaderLeftSide>
				<HeaderExtraSide>
					<NotificationMenu />
					<ProfileMenu />
				</HeaderExtraSide>
			</Header>

			<Page p={4} h="calc(100vh - 56px)">
				<PageCard w={600}>
					<PageCardHeader>
						<HeaderLeftSide>
							<Heading fontSize="xl">Данные пользователя</Heading>
						</HeaderLeftSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						<FormRow label="Имя:" required>
							<FormInput
								control={control}
								name="first_name"
								placeholder="Введите имя пользователя"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="Фамилия:" required>
							<FormInput
								control={control}
								name="last_name"
								placeholder="Введите фамилию пользователя"
								required
							/>
						</FormRow>
						<FormRow label="ПИНФЛ:" required>
							<FormNumberInput
								control={control}
								name="pinfl"
								placeholder="Введите ПИНФЛ пользователя"
								required
								rules={{ minLength: 14, maxLength: 14 }}
							/>
						</FormRow>
					</PageCardForm>

					<PageCardFooter mt={6}>
						<Button
							isLoading={createLoading || updateLoading}
							type="submit"
							ml="auto"
						>
              Сохранить
						</Button>
					</PageCardFooter>
				</PageCard>
			</Page>
		</form>
	);
};
export default UserDetail;
