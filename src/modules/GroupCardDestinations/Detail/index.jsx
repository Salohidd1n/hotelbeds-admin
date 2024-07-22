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
import FormImageUpload from 'components/FormElements/ImageUpload/FormImageUpload';
import {
	useGetGroupDestinationsById,
	useGroupDestinationsCreate,
	useGroupDestinationsUpdate,
} from 'services/group-destinations.service';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import FormCheckbox from 'components/FormElements/Checkbox/FormCheckbox';
import useHotelAction from 'hooks/useHotelAction';
import FormSwitch from 'components/FormElements/Switch/FormSwitch';
import downloadTemplate from 'utils/downloadTemplate';
import { useGetSections } from 'services/section.service';
import FormSelect from 'components/FormElements/Select/FormSelect';
import { useGetMarkups } from 'services/markup.service';
import markupPoolService from 'services/markupPool.service';

const GroupCardDestinationsDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit, setValue } = useForm({
		defaultValues: {
			hotelCode: [{}],
		},
	});

	const { data: sections } = useGetSections({
		params: {
			page: 1,
			page_size: 1000,
		},
		queryParams: {
			select: (res) => {
				return res.data.results
					.filter((item) => item.template === 'group-card')
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

	const { fields, append } = useFieldArray({
		control,
		name: 'hotelCode',
	});

	const hotelCodes = useWatch({
		control,
		name: 'hotelCode',
	});

	const { isLoading } = useGetGroupDestinationsById({
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

	const { mutateAsync: create, isLoading: createLoading } =
    useGroupDestinationsCreate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	const { mutateAsync: update, isLoading: updateLoading } =
    useGroupDestinationsUpdate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	const onSubmit = async (data) => {
		try {
			const values = { ...data };
			if (!id) {
				let markUpPoolId = '';
				if (values.markUpId) {
					const res = await markupPoolService.create({
						specialMarkupId: values.markUpId,
						hotels: values.hotelCode.map((item) => ({
							hotelCode: item.JPCode,
						})),
					});
					markUpPoolId = res.data.id;
				}
				await create({
					...values,
					markUpId: values.markUpId,
					hotelCode: values.hotelCode.map((item) => item.JPCode),
					markUpPoolId,
				});
			} else {
				if (values.markUpId && !values.markUpPoolId) {
					const res = await markupPoolService.create({
						specialMarkupId: values.markUpId,
						hotels: values.hotelCode.map((item) => ({
							hotelCode: item.JPCode,
						})),
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

				await update({
					id,
					data: {
						...values,
						hotelCode: values.hotelCode.map((item) => item.JPCode),
					},
				});
			}
		} catch (e) {
			console.log('e', e);
		}
	};

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
					<HeaderTitle>Group Cards</HeaderTitle>
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
							<FormRow label="Location (EN):" required>
								<FormInput
									control={control}
									name="en_location"
									placeholder="Enter location"
									autoFocus
									required
								/>
							</FormRow>
							<FormRow label="Location (KR):" required>
								<FormInput
									control={control}
									name="kr_location"
									placeholder="Enter location"
									required
								/>
							</FormRow>
							<FormRow label="Content (EN):" required>
								<FormInput
									control={control}
									name="en_content"
									placeholder="Enter content"
									required
								/>
							</FormRow>
							<FormRow label="Content (KR):" required>
								<FormInput
									control={control}
									name="kr_content"
									placeholder="Enter content"
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
							<FormRow label="Order:" required>
								<FormNumberInput
									control={control}
									name="order"
									placeholder="Enter order"
									required
								/>
							</FormRow>
							<FormRow label="Active:">
								<FormSwitch control={control} name="is_active" />
							</FormRow>
							<FormRow label="Image:" required>
								<FormImageUpload control={control} name="imageURL" required />
							</FormRow>
						</PageCardForm>
					</PageCard>
					<PageCard w="50%">
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
							<Grid templateColumns="repeat(2, 1fr)" gap={6}>
								{fields.map((item, index) => (
									<Flex alignItems="center" key={item.id} gap={3}>
										<FormCheckbox
											control={control}
											name={`hotelCode[${index}].checked`}
											size="lg"
											mt="25px"
										/>

										<FormRow label="JP Code:" required>
											<FormInput
												control={control}
												name={`hotelCode[${index}].JPCode`}
												placeholder="Enter JP Code"
												required
											/>
										</FormRow>
										{/* {fields.length > 1 && (
                      <IconButton
                        onClick={() => remove(index)}
                        mt={8}
                        colorScheme='red'
                        variant='outline'
                      >
                        <DeleteIcon />
                      </IconButton>
                    )} */}
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
export default GroupCardDestinationsDetailPage;
