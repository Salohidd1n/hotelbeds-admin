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
import ImageUpload from 'components/FormElements/ImageUpload/FormImageUpload';
import {
	useGetLocations,
	useGetLocationsById,
	useLocationsCreate,
	useLocationsUpdate,
} from 'services/location.service';
import FormTextarea from 'components/FormElements/Input/FormTextarea';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import FormSelect from 'components/FormElements/Select/FormSelect';
import {
	useGetRecommendedDestinationsById,
	useRecommendedDestinationsCreate,
	useRecommendedDestinationsUpdate,
} from 'services/recommended-destination.service';

const initialHeader = {
	en_headerTitle: '',
	kr_headerTitle: '',
	en_hederContent: '',
	kr_hederContent: '',
};

const initialGroupDestination = {
	en_title: '',
	kr_title: '',
	en_address: '',
	kr_address: '',
	en_content: '',
	kr_content: '',
};

const initialPopularHotels = {
	JPCode: '',
	tripadvisorReview: {
		rayting: undefined,
		reviews: undefined,
	},
};
const RecommendedDestionationDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();
	const locations = useGetLocations({
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
	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			header: [
				{
					...initialHeader,
				},
			],
			groupDestination: [
				{
					...initialGroupDestination,
				},
			],
			popular: [
				{
					...initialPopularHotels,
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'header',
	});

	const {
		fields: popularHotels,
		append: popularHotelsAppend,
		remove: popularHotelsRemove,
	} = useFieldArray({
		control,
		name: 'popular',
	});

	const {
		fields: groupDestinations,
		append: groupDestinationsAppend,
		remove: groupDestinationsRemove,
	} = useFieldArray({
		control,
		name: 'groupDestination',
	});

	const { isLoading } = useGetRecommendedDestinationsById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => {
				console.log(res);
				reset({
					...res.data,
					'locations-image': res.data.imageURL,
				});
			},
		},
	});

	const { mutate: createLocation, isLoading: createLoading } =
    useRecommendedDestinationsCreate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });
	const { mutate: updateLocation, isLoading: updateLoading } =
    useRecommendedDestinationsUpdate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	const onSubmit = (values) => {
		if (!id) createLocation(values);
		else {
			updateLocation({
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
					<HeaderTitle>Recommended Destinations</HeaderTitle>
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
				<PageCard w={400}>
					<PageCardHeader>
						<HeaderLeftSide>
							<Heading fontSize="xl">Locations</Heading>
						</HeaderLeftSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						<FormRow label="Select location:" required>
							<FormSelect
								control={control}
								name="locationId"
								placeholder="Select location"
								required
								options={locations.data || []}
								autoFocus
							/>
						</FormRow>
					</PageCardForm>
				</PageCard>
				<PageCard mt={4} w="100%">
					<PageCardHeader>
						<HeaderLeftSide>
							<Heading fontSize="xl">Banner</Heading>
						</HeaderLeftSide>
						<HeaderExtraSide>
							<Button
								onClick={() => append(initialHeader)}
								bgColor="primary.main"
								leftIcon={<AddIcon />}
							>
                Add banner
							</Button>
						</HeaderExtraSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						{fields.map((_, index) => (
							<Flex gap={2} key={index + 'banner'}>
								<Grid
									w="calc(100% - 50px)"
									templateColumns="repeat(3, 1fr)"
									gap={6}
								>
									<FormRow label="KR title:" required>
										<FormInput
											control={control}
											name={`header[${index}].en_headerTitle`}
											placeholder="Enter EN title"
											required
										/>
									</FormRow>
									<FormRow label="KR title:" required>
										<FormInput
											control={control}
											name={`header[${index}].kr_headerTitle`}
											placeholder="Enter KR title"
											required
										/>
									</FormRow>
									<FormRow label="EN content:" required>
										<FormTextarea
											control={control}
											name={`header[${index}].en_hederContent`}
											placeholder="Enter EN content"
											required
										/>
									</FormRow>
									<FormRow label="KR content:" required>
										<FormTextarea
											control={control}
											name={`header[${index}].kr_hederContent`}
											placeholder="Enter KR content"
											required
										/>
									</FormRow>
									<FormRow label="Image:" required>
										<ImageUpload
											control={control}
											name={`header[${index}].headerImageURL`}
											required
										/>
									</FormRow>
								</Grid>
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
					</PageCardForm>
				</PageCard>
				<PageCard mt={4} w="100%">
					<PageCardHeader>
						<HeaderLeftSide>
							<Heading fontSize="xl">Group Destinations</Heading>
						</HeaderLeftSide>
						<HeaderExtraSide>
							<Button
								onClick={() => groupDestinationsAppend(initialGroupDestination)}
								bgColor="primary.main"
								leftIcon={<AddIcon />}
							>
                Add group destinations
							</Button>
						</HeaderExtraSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						{groupDestinations.map((_, index) => (
							<Flex gap={2} key={index + 'groupDestinations'}>
								<Grid
									w="calc(100% - 50px)"
									templateColumns="repeat(3, 1fr)"
									gap={6}
								>
									<FormRow label="EN title:" required>
										<FormInput
											control={control}
											name={`groupDestination[${index}].en_title`}
											placeholder="Enter EN title"
											required
										/>
									</FormRow>
									<FormRow label="KR title:" required>
										<FormInput
											control={control}
											name={`groupDestination[${index}].kr_title`}
											placeholder="Enter KR title"
											required
										/>
									</FormRow>
									<FormRow label="EN address:" required>
										<FormInput
											control={control}
											name={`groupDestination[${index}].en_address`}
											placeholder="Enter EN address"
											required
										/>
									</FormRow>
									<FormRow label="KR address:" required>
										<FormInput
											control={control}
											name={`groupDestination[${index}].kr_address`}
											placeholder="Enter KR address"
											required
										/>
									</FormRow>
									<FormRow label="EN content:" required>
										<FormTextarea
											control={control}
											name={`groupDestination[${index}].en_content`}
											placeholder="Enter EN content"
											required
										/>
									</FormRow>
									<FormRow label="KR content:" required>
										<FormTextarea
											control={control}
											name={`groupDestination[${index}].kr_content`}
											placeholder="Enter KR content"
											required
										/>
									</FormRow>
									<FormRow label="Order:" required>
										<FormNumberInput
											control={control}
											name={`groupDestination[${index}].order`}
											placeholder="Enter order"
											required
										/>
									</FormRow>
									<FormRow label="Image:" required>
										<ImageUpload
											control={control}
											name={`groupDestination[${index}].imageURL`}
											required
										/>
									</FormRow>
								</Grid>
								{groupDestinations.length > 1 && (
									<IconButton
										onClick={() => groupDestinationsRemove(index)}
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
							<Heading fontSize="xl">Popular Hotels</Heading>
						</HeaderLeftSide>
						<HeaderExtraSide>
							<Button
								onClick={() => popularHotelsAppend(initialPopularHotels)}
								bgColor="primary.main"
								leftIcon={<AddIcon />}
							>
                Add hotels
							</Button>
						</HeaderExtraSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						{popularHotels.map((_, index) => (
							<Flex key={index + 'popularHotels'} gap={2}>
								<Grid
									w="calc(100% - 50px)"
									templateColumns="repeat(3, 1fr)"
									gap={6}
								>
									<FormRow label="JP Code:" required>
										<FormInput
											control={control}
											name={`popular[${index}].JPCode`}
											placeholder="Enter JPCode"
											required
										/>
									</FormRow>
									<FormRow label="Tripadvisor Review Rating:" required>
										<FormNumberInput
											control={control}
											name={`popular[${index}].tripadvisorReview.rayting`}
											placeholder="Enter rayting"
											required
										/>
									</FormRow>
									<FormRow label="Tripadvisor Review Count:" required>
										<FormNumberInput
											control={control}
											name={`popular[${index}].tripadvisorReview.reviews`}
											placeholder="Enter reviews count"
											required
										/>
									</FormRow>
								</Grid>
								{popularHotels.length > 1 && (
									<IconButton
										onClick={() => popularHotelsRemove(index)}
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
export default RecommendedDestionationDetailPage;
