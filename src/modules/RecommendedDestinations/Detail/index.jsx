import {
	Button,
	Flex,
	Grid,
	GridItem,
	Heading,
	IconButton,
} from '@chakra-ui/react';
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

import FormTextarea from 'components/FormElements/Input/FormTextarea';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import FormSelect from 'components/FormElements/Select/FormSelect';
import {
	useGetRecommendedDestinationsById,
	useRecommendedDestinationsCreate,
	useRecommendedDestinationsUpdate,
} from 'services/recommended-destination.service';
import { useGetLocations } from 'services/location.service';
import FormSwitch from 'components/FormElements/Switch/FormSwitch';

const initialHeader = {
	en_headerTitle: '',
	kr_headerTitle: '',
	en_hederContent: '',
	kr_hederContent: '',
	is_active: true,
};

const initialGroupDestination = {
	en_title: '',
	kr_title: '',
	en_address: '',
	kr_address: '',
	en_content: '',
	kr_content: '',
	is_active: true,
};

const initialPopularHotels = {
	JPCode: '',
	is_active: true,
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
	const { control, reset, handleSubmit, watch } = useForm({
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
				reset({
					...res.data,
				});
			},
		},
	});

	const { mutate: create, isLoading: createLoading } =
    useRecommendedDestinationsCreate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });
	const { mutate: update, isLoading: updateLoading } =
    useRecommendedDestinationsUpdate({
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
				<PageCard w="30%">
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
							<Flex
								gap={2}
								key={index + 'banner'}
								borderBottom={
									index === fields.length - 1 ? '' : '1px solid #E2E8F0'
								}
								pb={index === fields.length - 1 ? 0 : 10}
							>
								<Grid
									w="calc(100% - 50px)"
									templateColumns="repeat(4, 1fr)"
									gap={6}
								>
									<FormRow label="Title (EN):" required>
										<FormInput
											control={control}
											name={`header[${index}].en_headerTitle`}
											placeholder="Enter title"
											required
										/>
									</FormRow>
									<FormRow label="Title (KR):" required>
										<FormInput
											control={control}
											name={`header[${index}].kr_headerTitle`}
											placeholder="Enter title"
											required
										/>
									</FormRow>
									<FormRow label="Content (EN):" required>
										<FormTextarea
											control={control}
											name={`header[${index}].en_hederContent`}
											placeholder="Enter content"
											required
										/>
									</FormRow>
									<FormRow label="Content (KR):" required>
										<FormTextarea
											control={control}
											name={`header[${index}].kr_hederContent`}
											placeholder="Enter content"
											required
										/>
									</FormRow>
									<FormRow label="Order:" required>
										<FormNumberInput
											control={control}
											name={`header[${index}].order`}
											placeholder="Enter order"
											required
										/>
									</FormRow>
									<FormRow label="Active:">
										<FormSwitch
											control={control}
											name={`header[${index}].is_active`}
										/>
									</FormRow>
									<GridItem colSpan={2}>
										<Grid templateColumns="repeat(3, 1fr)">
											<FormRow label="Browser Image:" required>
												<ImageUpload
													control={control}
													name={`header[${index}].headerImageURL.browser`}
													required
												/>
											</FormRow>
											<FormRow label="Tablet Image:" required>
												<ImageUpload
													control={control}
													name={`header[${index}].headerImageURL.tablet`}
													required
												/>
											</FormRow>
											<FormRow label="Mobile Image:" required>
												<ImageUpload
													control={control}
													name={`header[${index}].headerImageURL.mobile`}
													required
												/>
											</FormRow>
										</Grid>
									</GridItem>
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
							<Flex
								gap={2}
								key={index + 'groupDestinations'}
								borderBottom={
									index === groupDestinations.length - 1
										? ''
										: '1px solid #E2E8F0'
								}
								pb={index === groupDestinations.length - 1 ? 0 : 10}
							>
								<Grid
									w="calc(100% - 50px)"
									templateColumns="repeat(3, 1fr)"
									gap={6}
								>
									<FormRow label="Title (EN):" required>
										<FormInput
											control={control}
											name={`groupDestination[${index}].en_title`}
											placeholder="Enter title"
											required
										/>
									</FormRow>
									<FormRow label="Title (KR):" required>
										<FormInput
											control={control}
											name={`groupDestination[${index}].kr_title`}
											placeholder="Enter title"
											required
										/>
									</FormRow>
									<FormRow label="Address (EN):" required>
										<FormInput
											control={control}
											name={`groupDestination[${index}].en_address`}
											placeholder="Enter address"
											required
										/>
									</FormRow>
									<FormRow label="Address (KR):" required>
										<FormInput
											control={control}
											name={`groupDestination[${index}].kr_address`}
											placeholder="Enter address"
											required
										/>
									</FormRow>
									<FormRow label="Content (EN):" required>
										<FormTextarea
											control={control}
											name={`groupDestination[${index}].en_content`}
											placeholder="Enter content"
											required
										/>
									</FormRow>
									<FormRow label="Content (KR):" required>
										<FormTextarea
											control={control}
											name={`groupDestination[${index}].kr_content`}
											placeholder="Enter content"
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
									<FormRow label="Active:">
										<FormSwitch
											control={control}
											name={`groupDestination[${index}].is_active`}
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
									templateColumns="repeat(5, 1fr)"
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
									<FormRow label="Order:" required>
										<FormNumberInput
											control={control}
											name={`popular[${index}].order`}
											placeholder="Enter order"
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
									<FormRow label="Active:">
										<FormSwitch
											control={control}
											name={`popular[${index}].is_active`}
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
