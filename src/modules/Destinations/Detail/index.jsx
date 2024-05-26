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
	PageCardFooter,
	PageCardForm,
	PageCardHeader,
} from '../../../components/PageCard';
import ProfileMenu from '../../../components/ProfileMenu';
import useCustomToast from '../../../hooks/useCustomToast';
import FormNumberInput from 'components/FormElements/Input/FormNumberInput';
import FormTextarea from 'components/FormElements/Input/FormTextarea';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import FormSelect from 'components/FormElements/Select/FormSelect';
import {
	useDestinationsCreate,
	useDestinationsUpdate,
	useGetDestinationsById,
} from 'services/destination.service';
import { useGetLocations } from 'services/location.service';
import { useGetRecommendedDestinationsByLocationId } from 'services/recommended-destination.service';
import FormMultipleImageUpload from 'components/FormElements/ImageUpload/FormMultipleImageUpload';
import MultipleImageUpload from 'components/FormElements/ImageUpload/MultipleImageUpload';
import FormImageUpload from 'components/FormElements/ImageUpload/FormImageUpload';

const initialHearbyHotes = {
	JPCode: '',
};

const initialLocations = {
	JPCode: '',
};

const initialDestination = {
	en_name: '',
};
const DestinationDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();
	const locationsData = useGetLocations({
		params: {
			page: 1,
			limit: 1000,
		},
		queryParams: {
			select: (res) => {
				return res.data.results.map((item) => ({
					...item,
					value: item.id,
					label: item.en_title,
				}));
			},
		},
	});

	const { control, reset, handleSubmit, watch } = useForm({
		defaultValues: {
			nearbyHotes: [initialHearbyHotes],
			location: [initialLocations],
			restourants: {
				destination: [initialDestination],
			},
		},
	});

	const {
		fields: destination,
		append: destinationAppend,
		remove: destinationRemove,
	} = useFieldArray({
		control,
		name: 'restourants.destination',
	});
	const {
		fields: nearbyHotes,
		append: nearbyHotesAppend,
		remove: nearbyHotesRemove,
	} = useFieldArray({
		control,
		name: 'nearbyHotes',
	});

	const {
		fields: locations,
		append: locationsAppend,
		remove: locationsRemove,
	} = useFieldArray({
		control,
		name: 'location',
	});

	const groupDestinationsData = useGetRecommendedDestinationsByLocationId({
		id: watch('locationId'),
		queryParams: {
			cacheTime: false,
			enabled: Boolean(watch('locationId')),
			select: (res) => {
				return res?.data?.groupDestination?.map((item) => ({
					...item,
					value: item._id,
					label: item.en_title,
				}));
			},
		},
	});

	const { isLoading } = useGetDestinationsById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => {
				reset({
					...res.data,
				});
			},
		},
	});

	const { mutate: create, isLoading: createLoading } = useDestinationsCreate({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});
	const { mutate: update, isLoading: updateLoading } = useDestinationsUpdate({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});

	const onSubmit = (values) => {
		if (!id) create(values);
		else {
			update({
				id,
				data: values,
			});
		}
	};

	if (isLoading) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Destinations</HeaderTitle>
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
				<Grid templateColumns="repeat(3, 1fr)" gap={6}>
					<PageCard>
						<PageCardHeader>
							<HeaderLeftSide>
								<Heading fontSize="xl">Location</Heading>
							</HeaderLeftSide>
						</PageCardHeader>

						<PageCardForm p={6} spacing={8}>
							<FormRow label="Select location:" required>
								<FormSelect
									control={control}
									name="locationId"
									placeholder="Select group location"
									required
									options={locationsData.data || []}
									autoFocus
								/>
							</FormRow>
						</PageCardForm>
					</PageCard>
					<PageCard>
						<PageCardHeader>
							<HeaderLeftSide>
								<Heading fontSize="xl">Group Destination</Heading>
							</HeaderLeftSide>
						</PageCardHeader>

						<PageCardForm p={6} spacing={8}>
							<FormRow label="Select destination:" required>
								<FormSelect
									control={control}
									name="groupDestinationId"
									placeholder="Select group destination"
									required
									disabled={!watch('locationId')}
									options={groupDestinationsData?.data || []}
								/>
							</FormRow>
						</PageCardForm>
					</PageCard>
				</Grid>
				<PageCard mt={4} w="100%">
					<PageCardHeader>
						<HeaderLeftSide>
							<Heading fontSize="xl">Header</Heading>
						</HeaderLeftSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						<Grid templateColumns="repeat(3, 1fr)" gap={6}>
							<FormRow label="EN title:" required>
								<FormInput
									control={control}
									name="header.en_title"
									placeholder="Enter EN title"
									required
								/>
							</FormRow>
							<FormRow label="KR title:" required>
								<FormInput
									control={control}
									name="header.kr_title"
									placeholder="Enter KR title"
									required
								/>
							</FormRow>

							<FormRow label="EN content:" required>
								<FormInput
									control={control}
									name="header.en_content"
									placeholder="Enter EN content"
									required
								/>
							</FormRow>
							<FormRow label="KR content:" required>
								<FormInput
									control={control}
									name="header.kr_content"
									placeholder="Enter KR content"
									required
								/>
							</FormRow>
							<FormRow label="EN sub content:" required>
								<FormInput
									control={control}
									name="header.en_subContent"
									placeholder="Enter EN content"
									required
								/>
							</FormRow>
							<FormRow label="KR sub content:" required>
								<FormInput
									control={control}
									name="header.kr_subContent"
									placeholder="Enter KR sub content"
									required
								/>
							</FormRow>
						</Grid>
						<FormRow label="Images:" required>
							<FormMultipleImageUpload
								control={control}
								name="header.imagesURL"
								required
							/>
						</FormRow>
					</PageCardForm>
				</PageCard>
				<PageCard mt={4} w="100%">
					<PageCardHeader>
						<HeaderLeftSide>
							<Heading fontSize="xl">Map Locations</Heading>
						</HeaderLeftSide>
						<HeaderExtraSide>
							<Button
								onClick={() => locationsAppend(initialLocations)}
								bgColor="primary.main"
								leftIcon={<AddIcon />}
							>
                Add location
							</Button>
						</HeaderExtraSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						{locations.map((_, index) => (
							<Flex gap={2} key={index + 'locations'}>
								<Grid
									w="calc(100% - 50px)"
									templateColumns="repeat(3, 1fr)"
									gap={6}
								>
									<FormRow label="JP Code:" required>
										<FormInput
											control={control}
											name={`location[${index}].JPCode`}
											placeholder="Enter JP Code"
											required
										/>
									</FormRow>
									<FormRow label="Latitude:" required>
										<FormNumberInput
											control={control}
											name={`location[${index}].latitude`}
											placeholder="Enter latitude"
											required
										/>
									</FormRow>
									<FormRow label="Longitude:" required>
										<FormNumberInput
											control={control}
											name={`location[${index}].longitude`}
											placeholder="Enter longitude"
											required
										/>
									</FormRow>
									<FormRow label="Hotel name EN:" required>
										<FormInput
											control={control}
											name={`location[${index}].en_hotelName`}
											placeholder="Enter hotel name EN"
											required
										/>
									</FormRow>
									<FormRow label="Hotel name KR:" required>
										<FormInput
											control={control}
											name={`location[${index}].kr_hotelName`}
											placeholder="Enter hotel name KR"
											required
										/>
									</FormRow>
									<FormRow label="Hotel Address EN:" required>
										<FormInput
											control={control}
											name={`location[${index}].en_hotelAddress`}
											placeholder="Enter hotel address EN"
											required
										/>
									</FormRow>
									<FormRow label="Hotel Address KR:" required>
										<FormInput
											control={control}
											name={`location[${index}].kr_hotelAddress`}
											placeholder="Enter hotel address KR"
											required
										/>
									</FormRow>
									<FormRow label="Hotel Description EN:" required>
										<FormTextarea
											control={control}
											name={`location[${index}].en_hotelDescription`}
											placeholder="Enter hotel description EN"
											required
										/>
									</FormRow>
									<FormRow label="Hotel Description KR:" required>
										<FormTextarea
											control={control}
											name={`location[${index}].KR_hotelDescription`}
											placeholder="Enter hotel description KR"
											required
										/>
									</FormRow>
									<FormRow label="Image:" required>
										<MultipleImageUpload
											control={control}
											name={`location[${index}].hotelImages`}
											required
										/>
									</FormRow>
								</Grid>
								{locations.length > 1 && (
									<IconButton
										onClick={() => locationsRemove(index)}
										mt={8}
										colorScheme="red"
										variant="outline"
									>
										<DeleteIcon />
									</IconButton>
								)}
							</Flex>
						))}
					</PageCardForm>
				</PageCard>
				<PageCard mt={4} w="100%">
					<PageCardHeader>
						<HeaderLeftSide>
							<Heading fontSize="xl">Restourants</Heading>
						</HeaderLeftSide>
						<HeaderExtraSide>
							<Button
								onClick={() => destinationAppend(initialDestination)}
								bgColor="primary.main"
								leftIcon={<AddIcon />}
							>
                Add restourant
							</Button>
						</HeaderExtraSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						<Grid
							w="calc(100% - 50px)"
							templateColumns="repeat(3, 1fr)"
							gap={6}
						>
							<FormRow label="EN title:" required>
								<FormInput
									control={control}
									name={'restourants.en_title'}
									placeholder="Enter EN title"
									required
								/>
							</FormRow>
							<FormRow label="KR title:" required>
								<FormInput
									control={control}
									name={'restourants.kr_title'}
									placeholder="Enter KR title"
									required
								/>
							</FormRow>
							<FormRow label="Order:" required>
								<FormNumberInput
									control={control}
									name={'restourants.order'}
									placeholder="Enter order"
									required
								/>
							</FormRow>
						</Grid>
						{destination.map((_, index) => (
							<Flex key={index + 'destination'} gap={2}>
								<Grid
									w="calc(100% - 50px)"
									templateColumns="repeat(3, 1fr)"
									gap={6}
								>
									<FormRow label="EN name:" required>
										<FormInput
											control={control}
											name={`restourants.destination[${index}].en_name`}
											placeholder="Enter EN name"
											required
										/>
									</FormRow>
									<FormRow label="KR name:" required>
										<FormInput
											control={control}
											name={`restourants.destination[${index}].kr_name`}
											placeholder="Enter KR name"
											required
										/>
									</FormRow>
									<FormRow label="EN address:" required>
										<FormInput
											control={control}
											name={`restourants.destination[${index}].en_address`}
											placeholder="Enter EN address"
											required
										/>
									</FormRow>
									<FormRow label="KR address:" required>
										<FormInput
											control={control}
											name={`restourants.destination[${index}].kr_address`}
											placeholder="Enter KR address"
											required
										/>
									</FormRow>
									<FormRow label="Image:" required>
										<FormImageUpload
											control={control}
											name={`restourants.destination[${index}].imageURL`}
											required
										/>
									</FormRow>
								</Grid>
								{destination.length > 1 && (
									<IconButton
										onClick={() => destinationRemove(index)}
										mt={8}
										colorScheme="red"
										variant="outline"
									>
										<DeleteIcon />
									</IconButton>
								)}
							</Flex>
						))}
					</PageCardForm>
				</PageCard>
				<PageCard mt={4} w="100%">
					<PageCardHeader>
						<HeaderLeftSide>
							<Heading fontSize="xl">Hearby Hotels</Heading>
						</HeaderLeftSide>
						<HeaderExtraSide>
							<Button
								onClick={() => nearbyHotesAppend(initialHearbyHotes)}
								bgColor="primary.main"
								leftIcon={<AddIcon />}
							>
                Add hotels
							</Button>
						</HeaderExtraSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						{nearbyHotes.map((_, index) => (
							<Flex key={index + 'initialHearbyHotes'} gap={2}>
								<Grid
									w="calc(100% - 50px)"
									templateColumns="repeat(4, 1fr)"
									gap={6}
								>
									<FormRow label="JP Code:" required>
										<FormInput
											control={control}
											name={`nearbyHotes[${index}].JPCode`}
											placeholder="Enter JPCode"
											required
										/>
									</FormRow>
									<FormRow label="Order:" required>
										<FormNumberInput
											control={control}
											name={`nearbyHotes[${index}].order`}
											placeholder="Enter order"
											required
										/>
									</FormRow>
									<FormRow label="Tripadvisor Review Rating:" required>
										<FormNumberInput
											control={control}
											name={`nearbyHotes[${index}].tripadvisorReview.rayting`}
											placeholder="Enter rayting"
											required
										/>
									</FormRow>
									<FormRow label="Tripadvisor Review Count:" required>
										<FormNumberInput
											control={control}
											name={`nearbyHotes[${index}].tripadvisorReview.reviews`}
											placeholder="Enter reviews count"
											required
										/>
									</FormRow>
								</Grid>
								{nearbyHotes.length > 1 && (
									<IconButton
										onClick={() => nearbyHotesRemove(index)}
										mt={8}
										colorScheme="red"
										variant="outline"
									>
										<DeleteIcon />
									</IconButton>
								)}
							</Flex>
						))}
					</PageCardForm>
				</PageCard>
			</Page>
		</form>
	);
};
export default DestinationDetailPage;
