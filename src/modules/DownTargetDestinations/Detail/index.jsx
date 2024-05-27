import { Button, Flex, Grid, Heading, IconButton } from '@chakra-ui/react';
import { useFieldArray, useForm } from 'react-hook-form';
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
	PageCardForm,
	PageCardHeader,
} from '../../../components/PageCard';
import ProfileMenu from '../../../components/ProfileMenu';
import useCustomToast from '../../../hooks/useCustomToast';
import FormNumberInput from 'components/FormElements/Input/FormNumberInput';

import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
	useGetUpTargetDestinationsById,
	useUpTargetDestinationsCreate,
	useUpTargetDestinationsUpdate,
} from 'services/up-target-destinations.service';
import {
	useDownTargetDestinationsCreate,
	useDownTargetDestinationsUpdate,
	useGetDownTargetDestinationsById,
} from 'services/down-target-destinations.service';

const DownTargetDestinationDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			hotelCode: [
				{
					JPCode: '',
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'hotelCode',
	});

	const { isLoading } = useGetDownTargetDestinationsById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => {
				reset({
					...res.data,
					hotelCode: res.data.hotelCode.map((item) => ({
						JPCode: item,
					})),
				});
			},
		},
	});

	const { mutate: create, isLoading: createLoading } =
    useDownTargetDestinationsCreate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });
	const { mutate: update, isLoading: updateLoading } =
    useDownTargetDestinationsUpdate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	const onSubmit = (values) => {
		if (!id)
			create({
				...values,
				hotelCode: values.hotelCode.map((item) => item.JPCode),
			});
		else {
			update({
				id,
				data: {
					...values,
					hotelCode: values.hotelCode.map((item) => item.JPCode),
				},
			});
		}
	};

	if (isLoading) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Get closer to the Europe you want to visit</HeaderTitle>
				</HeaderLeftSide>
				<HeaderExtraSide>
					<Button
						isLoading={createLoading || updateLoading}
						type="submit"
						ml="auto"
					>
            Save
					</Button>
					<NotificationMenu />
					<ProfileMenu />
				</HeaderExtraSide>
			</Header>

			<Page p={4} h="calc(100vh - 64px)">
				<Flex gap={4}>
					<PageCard w="50%">
						<PageCardHeader>
							<HeaderLeftSide>
								<Heading fontSize="xl">Destination Data</Heading>
							</HeaderLeftSide>
						</PageCardHeader>

						<PageCardForm p={6} spacing={8}>
							<FormRow label="Location:" required>
								<FormInput
									control={control}
									name="location"
									placeholder="Enter location"
									autoFocus
									required
								/>
							</FormRow>

							<FormRow label="Order:" required>
								<FormNumberInput
									control={control}
									name="order"
									placeholder="Enter order"
									required
								/>
							</FormRow>
							<FormRow label="Tripadvisor Review Rating:" required>
								<FormNumberInput
									control={control}
									name="tripadvisorReview.rayting"
									placeholder="Enter rayting"
									required
								/>
							</FormRow>
							<FormRow label="Tripadvisor Review Count:" required>
								<FormNumberInput
									control={control}
									name="tripadvisorReview.reviews"
									placeholder="Enter reviews count"
									required
								/>
							</FormRow>
						</PageCardForm>
					</PageCard>
					<PageCard w="50%">
						<PageCardHeader>
							<HeaderLeftSide>
								<Heading fontSize="xl">Hotels</Heading>
							</HeaderLeftSide>
							<HeaderExtraSide>
								<Button
									onClick={() =>
										append({
											JPCode: '',
										})
									}
									bgColor="primary.main"
									leftIcon={<AddIcon />}
								>
                  Add Hotels
								</Button>
							</HeaderExtraSide>
						</PageCardHeader>

						<PageCardForm p={6} spacing={8}>
							<Grid templateColumns="repeat(2, 1fr)" gap={6}>
								{fields.map((_, index) => (
									<Flex key={index} gap={3}>
										<FormRow label="JP Code:" required>
											<FormInput
												control={control}
												name={`hotelCode[${index}].JPCode`}
												placeholder="Enter JP Code"
												required
											/>
										</FormRow>
										{fields.length > 1 && (
											<IconButton
												onClick={() => remove(index)}
												mt={8}
												colorScheme="red"
												variant="outline"
											>
												<DeleteIcon />
											</IconButton>
										)}
									</Flex>
								))}
							</Grid>
						</PageCardForm>
					</PageCard>
				</Flex>
			</Page>
		</form>
	);
};
export default DownTargetDestinationDetailPage;
