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
import {
	useGetUpTargetDestinationsById,
	useUpTargetDestinationsCreate,
	useUpTargetDestinationsUpdate,
} from 'services/up-target-destinations.service';
import useHotelAction from 'hooks/useHotelAction';
import FormCheckbox from 'components/FormElements/Checkbox/FormCheckbox';
import FormSwitch from 'components/FormElements/Switch/FormSwitch';
import downloadTemplate from 'utils/downloadTemplate';
import { useGetSections } from 'services/section.service';
import { useGetMarkups } from 'services/markup.service';
import FormSelect from 'components/FormElements/Select/FormSelect';
import markupPoolService from 'services/markupPool.service';
import {
	useCreateSession,
	useGetHotelContent,
	useGetSessionById,
} from 'services/hotel.service';
import { useEffect, useState } from 'react';
import useHotelAvail from 'modules/Destinations/hooks/useHotelAvail';
import useReviews from 'modules/Destinations/hooks/useReviews';
import moment from 'moment';
// import file1 from '../../../assets/files/jpcode_csv_template.csv'
// import file2 from 'assets/files/jpcode_csv_template.xlsx'

const __defaultPaxes = [
	{
		roomId: 1,
		passangers: [
			{
				idPax: 1,
				age: 35,
			},
			{
				idPax: 2,
				age: 35,
			},
		],
	},
];

const UpTargetDestinationDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();
	const [JPCode, setJPCode] = useState(null);
	const getHotelContent = useGetHotelContent();
	const [sessionId, setSessionId] = useState();
	const { control, reset, handleSubmit, setValue } = useForm({
		defaultValues: {
			hotelCode: [
				{
					metaData: {},
				},
			],
		},
	});

	const createSession = useCreateSession();

	const { fields, append } = useFieldArray({
		control,
		name: 'hotelCode',
	});

	const hotelCode = useWatch({
		control,
		name: 'hotelCode',
	});

	const { data: sections } = useGetSections({
		params: {
			page: 1,
			page_size: 1000,
		},
		queryParams: {
			select: (res) => {
				return res.data.results
					.filter((item) => item.template === 'group-hotel')
					.map((value) => ({
						label: value.kr_title,
						value: value.id,
					}));
			},
		},
	});

	const { data: markups } = useGetMarkups({
		params: {
			page: 1,
			page_size: 1000,
		},
		queryParams: {
			select: (res) => {
				return [
					{ label: 'none', value: '' },
					...res.data.results.map((value) => ({
						label: value.type,
						value: value.id,
					})),
				];
			},
		},
	});

	const { isLoading } = useGetUpTargetDestinationsById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => {
				reset({
					...res.data,
					hotelCode: res.data.hotel.map((item) => ({
						JPCode: item.hotelCode,
						...item,
					})),
				});
			},
		},
	});

	const { data: sessionHotels } = useGetSessionById({
		sessionId: sessionId,
		queryParams: {
			enabled: !!sessionId,
		},
	});

	const onChangeHotels = (code, reviewsAmount, rating) => {
		const _popularHotelsData = JSON.parse(JSON.stringify(hotelCode));
		_popularHotelsData.forEach((hotel) => {
			if (hotel.JPCode === code) {
				hotel.metaData.tripadvisorReview.rayting = rating;
				hotel.metaData.tripadvisorReview.reviews = reviewsAmount;
				hotel.metaData.hotel = {
					images: getHotelContent.data.data.HotelContent.Images,
					...hotels[0].source,
				};
				hotel.metaData.hotelAvail = sessionHotels.data.hotels[0];
			}
		});
		setValue('hotelCode', _popularHotelsData);
		setTimeout(() => {
			setJPCode(null);
			setSessionId(null);
		}, 3000);
	};

	useEffect(() => {
		function getHContent() {
			getHotelContent.mutate({
				language: 'kr',
				JPCode: [JPCode],
			});
			const payload = {
				paxes: __defaultPaxes,
				language: 'kr',
				nationality: 'KR',
				checkInDate: moment(new Date()).add(29, 'days').format('yyyy-MM-DD'),
				checkOutDate: moment(new Date()).add(30, 'days').format('yyyy-MM-DD'),
				hotelCodes: JPCode ? [JPCode] : [],
				useCurrency: 'KRW',
			};
			createSession.mutate(payload, {
				onSuccess: (res) => {
					setSessionId(res.data.search_session_id);
				},
			});
		}

		if (JPCode) getHContent();
	}, [JPCode]);

	const { hotels, isLoading: isLoadingHotel } = useHotelAvail({
		hotelCodes: JPCode ? [JPCode] : [],
	});

	const { isLoading: isLoadingReview } = useReviews({
		hotelName: hotels && hotels[0]?.source?.en_name,
		hotelLat: hotels && hotels[0]?.source?.Latitude,
		hotelLng: hotels && hotels[0]?.source?.Longitude,
		language: 'ko',
		postalCode: getHotelContent?.data?.data?.HotelContent?.Address.PostalCode,
		onChange: onChangeHotels,
		JPCode,
	});

	// console.log('hotels', getHotelContent.data, hotels)

	const { mutateAsync: create, isLoading: createLoading } =
    useUpTargetDestinationsCreate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });
	const { mutateAsync: update, isLoading: updateLoading } =
    useUpTargetDestinationsUpdate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	const onSubmit = async (data) => {
		const values = { ...data };
		if (!id) {
			let markUpPoolId = '';
			if (values.markUpId) {
				const res = await markupPoolService.create({
					specialMarkupId: values.markUpId,
					hotels: values.hotelCode.map((item) => ({ hotelCode: item.JPCode })),
				});
				markUpPoolId = res.data.id;
			}
			create({
				...values,
				markUpPoolId,
				hotel: values.hotelCode.map((item) => ({
					hotelCode: item.JPCode,
					metaData: item.metaData,
				})),
			});
		} else {
			if (values.markUpId && !values.markUpPoolId) {
				const res = await markupPoolService.create({
					specialMarkupId: values.markUpId,
					hotels: values.hotelCode.map((item) => ({ hotelCode: item.JPCode })),
				});
				values.markUpPoolId = res.data.id;
			}

			if (values.markUpId && values.markUpPoolId) {
				await markupPoolService.update({
					id: values.markUpPoolId,
					data: {
						specialMarkupId: values.markUpId,
						hotels: values.hotelCode.map((item) => ({
							hotelCode: item.JPCode,
						})),
					},
				});
			}

			if (!values.markUpId && values.markUpPoolId) {
				await markupPoolService.delete(values.markUpPoolId);
				values.markUpPoolId = '';
				values.markUpId = '';
			}
			update({
				id,
				data: {
					...values,
					hotel: values.hotelCode.map((item) => ({
						hotelCode: item.JPCode,
						metaData: item.metaData,
					})),
				},
			});
		}
	};

	const hotelCodes = useWatch({
		control,
		name: 'hotelCode',
	});

	const { onDelete, onSelectAll, selectedHotels, uploadFile, fileRef } =
    useHotelAction({
    	hotelCodes,
    	onChange: (value) => setValue('hotelCode', value),
    });

	if (isLoading) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Hotel group</HeaderTitle>
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
					<PageCard w="30%">
						<PageCardHeader>
							<HeaderLeftSide>
								<Heading fontSize="xl">Hotel group Data</Heading>
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
							<FormRow label="Select section:" required>
								<FormSelect
									control={control}
									name="sectionId"
									placeholder="Select section"
									required
									options={sections || []}
								/>
							</FormRow>
							<FormRow label="Select markup:">
								<FormSelect
									control={control}
									name="markUpId"
									placeholder="Select markup"
									options={markups || []}
								/>
							</FormRow>
							{/* <FormRow label='Tripadvisor Review Rating:' required>
                <FormNumberInput
                  control={control}
                  name='tripadvisorReview.rayting'
                  placeholder='Enter rayting'
                  required
                />
              </FormRow>
              <FormRow label='Tripadvisor Review Count:' required>
                <FormNumberInput
                  control={control}
                  name='tripadvisorReview.reviews'
                  placeholder='Enter reviews count'
                  required
                />
              </FormRow> */}
							<FormRow label="Active:">
								<FormSwitch control={control} name="is_active" />
							</FormRow>
						</PageCardForm>
					</PageCard>
					<PageCard w="70%">
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
									<Heading fontSize="xl">Hotels</Heading>
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
									onClick={downloadTemplate}
									bgColor="primary.main"
									position="relative"
								>
                  Download template
								</Button>

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
									onClick={() =>
										append({
											JPCode: '',
											metaData: {},
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
							{fields.map((item, index) => (
								<Flex alignItems="end" key={item.id} gap={3}>
									<FormCheckbox
										control={control}
										name={`hotelCode[${index}].checked`}
										size="lg"
										mt="25px"
									/>

									<FormRow label="JP Code:" required maxW="150px">
										<FormInput
											control={control}
											name={`hotelCode[${index}].JPCode`}
											placeholder="Enter JP Code"
											required
										/>
									</FormRow>
									<FormRow
										label="Tripadvisor Review Rating:"
										required
										maxW="200px"
									>
										<FormNumberInput
											control={control}
											name={`hotelCode[${index}].metaData.tripadvisorReview.rayting`}
											placeholder="Enter rayting"
											required
										/>
									</FormRow>
									<FormRow
										label="Tripadvisor Review Count:"
										required
										maxW="200px"
									>
										<FormNumberInput
											control={control}
											name={`hotelCode[${index}].metaData.tripadvisorReview.reviews`}
											placeholder="Enter reviews count"
											required
										/>
									</FormRow>

									<Button
										onClick={() => setJPCode(hotelCode[index].JPCode)}
										variant="outline"
										isDisabled={
											getHotelContent.isLoading ||
                      isLoadingHotel ||
                      isLoadingReview
										}
										isLoading={
											(getHotelContent.isLoading ||
                        isLoadingHotel ||
                        isLoadingReview) &&
                      JPCode === hotelCode[index].JPCode
										}
									>
                    Get Tripadvisor Review
									</Button>
								</Flex>
							))}
						</PageCardForm>
					</PageCard>
				</Flex>
			</Page>
		</form>
	);
};
export default UpTargetDestinationDetailPage;
