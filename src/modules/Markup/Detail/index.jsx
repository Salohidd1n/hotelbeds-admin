import {
	Button,
	Checkbox,
	Flex,
	Grid,
	Heading,
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
	PageCardFooter,
	PageCardForm,
	PageCardHeader,
} from '../../../components/PageCard';
import ProfileMenu from '../../../components/ProfileMenu';
import useCustomToast from '../../../hooks/useCustomToast';
import FormSwitch from 'components/FormElements/Switch/FormSwitch';
import FormTextarea from 'components/FormElements/Input/FormTextarea';
import FormImageUpload from 'components/FormElements/ImageUpload/FormImageUpload';
import {
	useGetMarkupsById,
	useMarkupCreate,
	useMarkupUpdate,
} from 'services/markup.service';
import markupPoolService, {
	useGetMarkupsPool,
} from 'services/markupPool.service';
import FormCheckbox from 'components/FormElements/Checkbox/FormCheckbox';
import { useEffect, useMemo, useState } from 'react';
import useHotelAction from 'hooks/useHotelAction';
import downloadTemplate from 'utils/downloadTemplate';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import List from 'rc-virtual-list';

function chunkArray(array, chunkSize) {
	const result = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		result.push(chunk);
	}
	return result;
}

const MarkupDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();
	const [isLoadingData, setIsLoadingData] = useState(false);
	const { control, reset, handleSubmit, setValue } = useForm({
		defaultValues: {
			hotelCode: [],
		},
	});

	const { fields, append } = useFieldArray({
		control,
		name: 'hotelCode',
	});

	const chunkedArray = useMemo(() => {
		if (fields.length > 0) return chunkArray(fields, 2);
		return [];
	}, [fields]);

	console.log('fields', fields, chunkedArray);

	const hotelCodes = useWatch({
		control,
		name: 'hotelCode',
	});

	const markupId = useWatch({
		control,
		name: 'id',
	});

	const { isLoading } = useGetMarkupsById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => reset({ ...res.data, hotelCode: [] }),
		},
	});

	const { data: markupPool, isLoading: isLoadingMarkupPool } =
    useGetMarkupsPool({
    	params: {
    		page: 1,
    		page_size: 1000,
    		specialMarkupId: id,
    	},
    	queryParams: {
    		enabled: !!markupId,
    		onSuccess: (res) => {
    			const hotels = res.data.results
    				.map((item) => item.hotels)
    				.flat()
    				.map((item) => ({
    					JPCode: item.hotelCode,
    				}));
    			// setTimeout(() => {
    			setValue('hotelCode', hotels);
    			// }, 1500)
    		},
    	},
    });

	const { onDelete, onSelectAll, selectedHotels, uploadFile, fileRef } =
    useHotelAction({
    	hotelCodes: hotelCodes || [],
    	onChange: (value) => setValue('hotelCode', value),
    });

	const { mutate: createCountry, isLoading: createLoading } = useMarkupCreate({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});
	const { mutate: updateCountry, isLoading: updateLoading } = useMarkupUpdate({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});

	const onSubmit = async (values) => {
		setIsLoadingData(true);
		if (!id) createCountry(values);
		else {
			const markupHotels = values.hotelCode.map((item) => ({
				hotelCode: item.JPCode,
			}));
			await markupPoolService.update({
				id: markupPool.data.results[0].id,
				data: {
					specialMarkupId: id,
					hotels: markupHotels,
				},
			});
			updateCountry({
				id,
				data: values,
			});
		}
		setIsLoadingData(false);
	};

	if (isLoading || isLoadingMarkupPool) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Markup</HeaderTitle>
				</HeaderLeftSide>
				<HeaderExtraSide>
					<NotificationMenu />
					<ProfileMenu />
				</HeaderExtraSide>
			</Header>

			<Page p={4} h="calc(100vh - 64px)">
				<Flex gap={4}>
					<PageCard w="50%">
						<PageCardHeader>
							<HeaderLeftSide>
								<Heading fontSize="xl">Markup Data</Heading>
							</HeaderLeftSide>
						</PageCardHeader>

						<PageCardForm p={6} spacing={8}>
							<FormRow label="Type:" required>
								<FormInput
									control={control}
									name="type"
									placeholder="Enter type"
									autoFocus
									required
								/>
							</FormRow>
							<FormRow label="Description:" required>
								<FormTextarea
									control={control}
									name="description"
									placeholder="Enter Description"
									required
								/>
							</FormRow>
							<Grid templateColumns="repeat(3, 1fr)" gap={6}>
								<FormRow label="Browser Image:" required>
									<FormImageUpload
										control={control}
										name="imageURL.browser"
										required
									/>
								</FormRow>
								<FormRow label="Tablet Image:" required>
									<FormImageUpload
										control={control}
										name="imageURL.tablet"
										required
									/>
								</FormRow>
								<FormRow label="Mobile Image:" required>
									<FormImageUpload
										control={control}
										name="imageURL.mobile"
										required
									/>
								</FormRow>
							</Grid>
							<FormRow label="Active:">
								<FormSwitch control={control} name="is_active" />
							</FormRow>
						</PageCardForm>

						<PageCardFooter mt={6}>
							<Button
								isLoading={createLoading || updateLoading || isLoadingData}
								type="submit"
								ml="auto"
							>
                Save
							</Button>
						</PageCardFooter>
					</PageCard>
					{id && (
						<PageCard w="50%">
							<PageCardHeader>
								<HeaderLeftSide>
									{hotelCodes?.length > 0 ? (
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
									<Button
										onClick={downloadTemplate}
										bgColor="primary.main"
										position="relative"
									>
                    Download template
									</Button>
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
								<List
									data={chunkedArray}
									height={500}
									itemHeight={77}
									itemKey="id"
								>
									{(items, index) => (
										<HotelJPCode
											control={control}
											items={items}
											index={index}
										/>
									)}
								</List>

								{/* <Grid templateColumns='repeat(2, 1fr)' gap={6}>
                  {fields.map((item, index) => (
                    <Flex alignItems='center' key={item.id} gap={3}>
                      <FormCheckbox
                        control={control}
                        name={`hotelCode[${index}].checked`}
                        size='lg'
                        mt='25px'
                      />

                      <FormRow label='JP Code:' required>
                        <FormInput
                          control={control}
                          name={`hotelCode[${index}].JPCode`}
                          placeholder='Enter JP Code'
                          required
                        />
                      </FormRow>
                    </Flex>
                  ))}
                </Grid> */}
							</PageCardForm>
						</PageCard>
					)}
				</Flex>
			</Page>
		</form>
	);
};
export default MarkupDetailPage;

const HotelJPCode = ({ items, control, index }) => {
	return (
		<Grid templateColumns="repeat(2, 1fr)" gap={6} py={3}>
			{items.map((item, index2) => (
				<Flex alignItems="center" key={item.id} gap={3}>
					<FormCheckbox
						control={control}
						name={`hotelCode[${index * 2 + index2}].checked`}
						size="lg"
						mt="25px"
					/>
					<FormRow label="JP Code:" required>
						<FormInput
							control={control}
							name={`hotelCode[${index * 2 + index2}].JPCode`}
							placeholder="Enter JP Code"
							required
						/>
					</FormRow>
				</Flex>
			))}
		</Grid>
	);
};
