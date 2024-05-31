import {
	Button,
	Checkbox,
	Flex,
	Grid,
	Heading,
	IconButton,
	Input,
	Text,
} from '@chakra-ui/react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
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
import FormSelect from 'components/FormElements/Select/FormSelect';
import {
	useDestinationsCreate,
	useDestinationsUpdate,
	useGetDestinationsById,
} from 'services/destination.service';
import { useGetLocations } from 'services/location.service';
import { useGetRecommendedDestinationsByLocationId } from 'services/recommended-destination.service';
import FormMultipleImageUpload from 'components/FormElements/ImageUpload/FormMultipleImageUpload';
import useHotelAvail from '../hooks/useHotelAvail';
import { useState } from 'react';
import useRestaurants from '../hooks/useRestaurants';
import { IoIosRestaurant } from 'react-icons/io';
import styles from './index.module.scss';
import classNames from 'classnames';
import { RestaurantModal } from '../components/RestaurantModal';
import useHotelAction from 'hooks/useHotelAction';
import FormCheckbox from 'components/FormElements/Checkbox/FormCheckbox';

const initialHearbyHotes = {
	JPCode: '',
	restaurant: [],
	allRestaurants: [],
};

const DestinationDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();
	const [selectedRestaurant, setSelectedRestaurant] = useState(null);
	const [JPCode, setJPCode] = useState(null);
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

	const { control, reset, handleSubmit, watch, setValue } = useForm({
		defaultValues: {
			nearbyHotes: [],
		},
	});

	const nearbyHotelList = useWatch({
		control,
		name: 'nearbyHotes',
	});

	const { hotels, isLoading: isLoadingHotel } = useHotelAvail({
		hotelCodes: JPCode ? [JPCode] : [],
	});

	const onChangeNearbyHotels = (JPCode, restaurants) => {
		const _nearbyHotelList = JSON.parse(JSON.stringify(nearbyHotelList));
		_nearbyHotelList.forEach((hotel) => {
			if (hotel.JPCode === JPCode) {
				hotel.allRestaurants = restaurants;
			}
		});
		setValue('nearbyHotes', _nearbyHotelList);
		setJPCode(null);
	};

	const { isLoading: isLoadingRestaurant } = useRestaurants({
		hotels,
		onChangeNearbyHotels,
	});

	const onSelectRestaurant = (index, value) => {
		const _nearbyHotelList = JSON.parse(JSON.stringify(nearbyHotelList));
		const selectedRestaurants = _nearbyHotelList[index]?.restaurant;

		if (
			selectedRestaurants.find(
				(item) =>
					item.nearbyPlace.location_id === value.nearbyPlace.location_id,
			)
		) {
			_nearbyHotelList[index].restaurant = selectedRestaurants?.filter(
				(item) =>
					item.nearbyPlace.location_id !== value.nearbyPlace.location_id,
			);
		} else {
			_nearbyHotelList[index].restaurant.push(value);
		}

		setValue('nearbyHotes', _nearbyHotelList);
	};

	const {
		fields: nearbyHotes,
		append: nearbyHotesAppend,
		remove: nearbyHotesRemove,
	} = useFieldArray({
		control,
		name: 'nearbyHotes',
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
					nearbyHotes: res.data.nearbyHotes.map((item) => ({
						...item,
						allRestaurants: item.restaurant,
					})),
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

	const hotelCodes = useWatch({
		control,
		name: 'nearbyHotes',
	});

	const { onDelete, onSelectAll, selectedHotels, uploadFile, fileRef } =
    useHotelAction({
    	hotelCodes,
    	onChange: (value) => setValue('nearbyHotes', value),
    	initialFields: {
    		restaurant: [],
    	},
    });

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
							<FormRow label="Select group destination:" required>
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
							<FormRow label="Title (EN):" required>
								<FormInput
									control={control}
									name="header.en_title"
									placeholder="Enter title"
									required
								/>
							</FormRow>
							<FormRow label="Title (KR):" required>
								<FormInput
									control={control}
									name="header.kr_title"
									placeholder="Enter title"
									required
								/>
							</FormRow>

							<FormRow label="Content (EN):" required>
								<FormInput
									control={control}
									name="header.en_content"
									placeholder="Enter content"
									required
								/>
							</FormRow>
							<FormRow label="Content (KR):" required>
								<FormInput
									control={control}
									name="header.kr_content"
									placeholder="Enter content"
									required
								/>
							</FormRow>
							<FormRow label="Sub content (EN):" required>
								<FormInput
									control={control}
									name="header.en_subContent"
									placeholder="Enter sub content"
									required
								/>
							</FormRow>
							<FormRow label="Sub content (KR):" required>
								<FormInput
									control={control}
									name="header.kr_subContent"
									placeholder="Enter sub content"
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
							{hotelCodes.length > 0 ? (
								<Flex gap={4}>
									<Checkbox
										size="lg"
										onChange={onSelectAll}
										isChecked={selectedHotels.length === hotelCodes.length}
									/>
									<Text fontWeight="500" fontSize="14px">
                    Select all hotels
									</Text>
								</Flex>
							) : (
								<Heading fontSize="xl">Hearby Hotels</Heading>
							)}
						</HeaderLeftSide>
						<HeaderExtraSide>
							{selectedHotels.length > 0 && (
								<Button
									leftIcon={<DeleteIcon />}
									variant="outline"
									colorScheme="red"
									onClick={onDelete}
								>
                  Delete
								</Button>
							)}
							<Button
								bgColor="primary.main"
								onClick={() => fileRef.current.click()}
								position="relative"
							>
								<Input
									type="file"
									onChange={uploadFile}
									position="absolute"
									w="0"
									h="0"
									borderColor="transparent"
									ref={fileRef}
									zIndex="-1"
								/>
                Upload File
							</Button>
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
						{nearbyHotes.map((item, index) => (
							<Flex key={item.id} gap={2} alignItems="flex-start">
								<FormCheckbox
									control={control}
									name={`nearbyHotes[${index}].checked`}
									size="lg"
									mt={10}
								/>
								<Flex w="96%" flexDirection="column">
									<Grid w="100%" templateColumns="repeat(4, 1fr)" gap={6}>
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
									<Grid
										mt={6}
										w="100%"
										templateColumns="repeat(4, 1fr)"
										gap={6}
									>
										{nearbyHotelList[index]?.allRestaurants?.map(
											(item, ind) => (
												<div
													key={item.nearbyPlace.location_id}
													onClick={() => onSelectRestaurant(index, item)}
													className={classNames(styles.restaurantCard, {
														[styles.isActive]: nearbyHotelList[
															index
														]?.restaurant?.find(
															(value) =>
																value?.nearbyPlace?.location_id ===
                                item.nearbyPlace.location_id,
														),
													})}
												>
													<img src={item?.photos[0]?.images?.small?.url} />
													<div className={styles.content}>
														<p className={styles.name}>
															{item?.locationDetails?.name}
														</p>
														<p className={styles.address}>
															{
																item?.locationDetails?.address_obj
																	?.address_string
															}
														</p>
														<Button
															onClick={(e) => {
																e.stopPropagation();
																setSelectedRestaurant({
																	...item?.locationDetails,
																	...item?.nearbyPlace,
																	images: item?.photos,
																});
															}}
															variant="outline"
															mt={5}
															w="100%"
														>
                              Show more
														</Button>
													</div>
												</div>
											),
										)}
									</Grid>
								</Flex>
								<Flex
									w="8%"
									mt={8}
									alignItems="flex-start"
									justifyContent="flex-end"
									gap={3}
								>
									<IconButton
										onClick={() => {
											setJPCode(nearbyHotelList[index]?.JPCode);
										}}
										colorScheme="blue"
										variant="outline"
										isLoading={
											JPCode === nearbyHotelList[index]?.JPCode
												? isLoadingRestaurant || isLoadingHotel
												: false
										}
									>
										<IoIosRestaurant size="18" />
									</IconButton>
								</Flex>
							</Flex>
						))}
					</PageCardForm>
				</PageCard>
			</Page>
			<RestaurantModal
				isOpen={!!selectedRestaurant}
				onClose={() => setSelectedRestaurant(null)}
				locationId={selectedRestaurant?.location_id}
				title={selectedRestaurant?.name}
				rating={selectedRestaurant?.rating}
				reviewsCount={selectedRestaurant?.num_reviews}
				address={selectedRestaurant?.address_obj?.address_string}
				overallRate={selectedRestaurant?.ranking_data?.ranking_string}
				phone={selectedRestaurant?.phone}
				cuisines={selectedRestaurant?.cuisine
					?.map((cus) => cus?.localized_name)
					.join(',')}
				openTime={selectedRestaurant?.hours?.periods?.[0]?.open?.time?.replace(
					'00',
					':00',
				)}
				rateFood={Object.values(selectedRestaurant?.subratings || {})?.find(
					(el) => el?.name === 'rate_food',
				)}
				rateService={Object.values(selectedRestaurant?.subratings || {})?.find(
					(el) => el?.name === 'rate_service',
				)}
				rateValue={Object.values(selectedRestaurant?.subratings || {})?.find(
					(el) => el?.name === 'rate_value',
				)}
				images={(selectedRestaurant?.images || [])
					?.filter((image) => !!image?.images?.original?.url)
					?.map((image) => image.images.original.url)}
			/>
		</form>
	);
};
export default DestinationDetailPage;
