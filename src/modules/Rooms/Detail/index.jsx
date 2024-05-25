import { Button, Heading } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import FormRow from '../../../components/FormElements/FormRow';
import FormInput from '../../../components/FormElements/Input/FormInput';
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
	useGetRoomsById,
	useRoomsCreate,
	useRoomsUpdate,
} from 'services/room.service';

const RoomDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit } = useForm();

	const { isLoading } = useGetRoomsById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: reset,
		},
	});

	const { mutate: createRoom, isLoading: createLoading } = useRoomsCreate({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});
	const { mutate: updateRoom, isLoading: updateLoading } = useRoomsUpdate({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});

	const onSubmit = (values) => {
		if (!id) createRoom(values);
		else {
			updateRoom({
				id,
				...values,
			});
		}
	};

	if (isLoading) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Rooms</HeaderTitle>
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
							<Heading fontSize="xl">Rooms Data</Heading>
						</HeaderLeftSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						<FormRow label="JR code:" required>
							<FormInput
								control={control}
								name="JRCode"
								placeholder="Enter JR Code"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="EN name:" required>
							<FormInput
								control={control}
								name="en_name"
								placeholder="Enter EN name"
								required
							/>
						</FormRow>
						<FormRow label="KR name:" required>
							<FormInput
								control={control}
								name="kr_name"
								placeholder="Enter KR name"
								required
							/>
						</FormRow>
					</PageCardForm>

					<PageCardFooter mt={6}>
						<Button
							isLoading={createLoading || updateLoading}
							type="submit"
							ml="auto"
						>
              Save
						</Button>
					</PageCardFooter>
				</PageCard>
			</Page>
		</form>
	);
};
export default RoomDetailPage;
