import {
	Box,
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
	PageCardFooter,
	PageCardForm,
	PageCardHeader,
} from '../../../components/PageCard';
import ProfileMenu from '../../../components/ProfileMenu';
import useCustomToast from '../../../hooks/useCustomToast';
import FormSwitch from 'components/FormElements/Switch/FormSwitch';
import FormTextarea from 'components/FormElements/Input/FormTextarea';

import {
	useGetPromocodeTypes,
	useGetPromocodeTypesById,
	usePromocodeTypeCreate,
	usePromocodeTypeUpdate,
	useSendPromocodeToEmail,
} from 'services/promocodeType.service';
import FormNumberInput from 'components/FormElements/Input/FormNumberInput';
import FormSelect from 'components/FormElements/Select/FormSelect';
import FormRadioGroup from 'components/FormElements/RadioGroup/FormRadioGroup';
import { BiPlus, BiSend } from 'react-icons/bi';
import { DeleteIcon } from '@chakra-ui/icons';
import {
	useGetPromocodesById,
	usePromocodesUpdate,
} from 'services/promocodes.service';
import { useState } from 'react';

const options = [
	{
		value: 'CL',
		label: 'CL',
	},
	{
		value: 'WS',
		label: 'WS',
	},
	{
		value: 'GLN',
		label: 'GLN',
	},
];

const options2 = [
	{
		value: 'GIFT',
		label: 'GIFT',
	},
	{
		value: 'COUPON',
		label: 'COUPON',
	},
	{
		value: 'DISCOUNT',
		label: 'DISCOUNT',
	},
];

const InfulancersDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();
	const [promocode, setPromocode] = useState();
	const { control, reset, handleSubmit, setValue, watch } = useForm({
		defaultValues: {
			eventType: 'GIFT',
			emails: [
				{
					email: '',
				},
			],
		},
	});

	const promocodeType = useWatch({
		control,
		name: 'promocodeType',
	});

	const email = useWatch({
		control,
		name: 'email',
	});

	const dateFrom = useWatch({
		control,
		name: 'dateFrom',
	});

	const sendPromocodeToEmail = useSendPromocodeToEmail();

	const dateTo = useWatch({
		control,
		name: 'dateTo',
	});

	const { data: promocodeTypes } = useGetPromocodeTypes({
		params: {
			page: 1,
			page_size: 1000,
		},
		queryParams: {
			select: (res) => {
				return res.data.results.map((value) => ({
					...value,
					maxValue: value?.value,
					label: value.type,
					value: value.id,
				}));
			},
		},
	});

	const { isLoading } = useGetPromocodesById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => {
				setPromocode(res.data);
				setValue('promocodeType', res.data.promocodeTypeId);
				setValue('email', res.data.email);
				setValue('valid', res.data.valid);
			},
		},
	});

	useGetPromocodeTypesById({
		id: promocodeType,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(promocodeType),
			onSuccess: (res) => {
				reset({
					...watch(),
					...res.data,
					dateFrom: res.data.dateFrom.split('T')[0],
					dateTo: res.data.dateTo.split('T')[0],
					promocodeType,
				});
			},
		},
	});

	const { mutate: createCountry, isLoading: createLoading } =
    usePromocodeTypeCreate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });
	const { mutate: updateCountry, isLoading: updateLoading } =
    usePromocodesUpdate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	console.log('promocode', promocode);

	const onSubmit = async (values) => {
		const payload = { ...promocode, valid: values.valid };
		if (payload.createdAt) delete payload.createdAt;
		if (payload.updatedAt) delete payload.updatedAt;
		if (payload.id) delete payload.id;
		if (id) {
			updateCountry({
				id,
				data: payload,
			});
		}
	};

	const onSend = () => {
		if (email) {
			sendPromocodeToEmail.mutate(
				{
					email,
					promocodeTypeId: promocodeType,
				},
				{
					onSuccess: (res) => {
						successToast('Promo code sent by email!');
					},
				},
			);
		}
	};

	if (isLoading) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Infulancers</HeaderTitle>
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
								<Heading fontSize="xl">Infulancers Data</Heading>
							</HeaderLeftSide>
						</PageCardHeader>

						<PageCardForm p={6} spacing={8}>
							<FormRow label="Promocode Type" required>
								<FormSelect
									control={control}
									name="promocodeType"
									placeholder="Select promocode type"
									required
									options={promocodeTypes}
								/>
							</FormRow>

							{promocodeType && (
								<Flex alignItems="center" gap="6px">
									<FormRow label="Promocode Type" required>
										<FormInput
											control={control}
											name="email"
											placeholder="Enter email"
											required
										/>
									</FormRow>
									{!id && (
										<Flex alignItems="center" gap="6px" mt="25px">
											<IconButton
												onClick={onSend}
												variant="outline"
												colorScheme="gray"
												icon={<BiSend fontSize="20px" />}
											/>

											{/* <IconButton
                      // onClick={() => remove(index)}
                      variant='outline'
                      colorScheme='red'
                      icon={<DeleteIcon fontSize='13px' />}
                    /> */}
										</Flex>
									)}
								</Flex>
							)}

							{id && (
								<FormRow label="Valid:">
									<FormSwitch control={control} name="valid" />
								</FormRow>
							)}

							{promocodeType && (
								<>
									{/* <Box>
                    <Flex
                      alignItems='center'
                      justifyContent='space-between'
                      mb='12px'
                    >
                      <Text fontSize='14px' fontWeight={500}>
                        Email
                      </Text>
                      <IconButton
                        onClick={() => append({ email: '' })}
                        variant='outline'
                        colorScheme='gray'
                        icon={<BiPlus fontSize='20px' />}
                      />
                    </Flex>
                    {fields.map((item, index) => (
                      <Flex
                        key={item.id}
                        alignItems='center'
                        gap='6px'
                        mb='10px'
                      >
                        <FormInput
                          control={control}
                          name={`emails.${index}.email`}
                          placeholder='Enter email'
                          required
                        />

                        <Flex alignItems='center' gap='6px'>
                          <IconButton
                            onClick={() => append({ email: '' })}
                            variant='outline'
                            colorScheme='gray'
                            icon={<BiSend fontSize='20px' />}
                          />

                          <IconButton
                            onClick={() => remove(index)}
                            variant='outline'
                            colorScheme='red'
                            icon={<DeleteIcon fontSize='13px' />}
                          />
                        </Flex>
                      </Flex>
                    ))}
                  </Box> */}
									<FormRow label="Issuer" required>
										<FormSelect
											control={control}
											name="issuer"
											placeholder="Select issuer"
											required
											options={options}
											disabled
										/>
									</FormRow>
									<FormRow label="Event type" required>
										<FormRadioGroup
											name="eventType"
											control={control}
											options={options2}
											required
											isDisabled
										/>
									</FormRow>
									<FormRow label="Type:" required>
										<FormInput
											control={control}
											name="type"
											disabled
											inputProps={{
												onChange: (e) => {
													if (e.target.value.length <= 5) {
														setValue('type', e.target.value.toUpperCase());
													}
												},
											}}
											placeholder="Enter type (ex. CL900)"
											required
										/>
									</FormRow>
									<FormRow label="Value:" required>
										<FormNumberInput
											control={control}
											name="value"
											placeholder="Enter value"
											required
											disabled
										/>
									</FormRow>
									<FormRow label="Max usage allowed:" required>
										<FormNumberInput
											control={control}
											name="maxUsageAllowed"
											placeholder="Enter max usage"
											required
											disabled
										/>
									</FormRow>
									<FormRow label="Description:" required>
										<FormTextarea
											control={control}
											name="description"
											placeholder="Enter Description"
											required
											disabled
										/>
									</FormRow>
									<FormRow label="Date from:" required>
										<FormInput
											control={control}
											name="dateFrom"
											inputProps={{
												type: 'date',
												max: dateTo,
											}}
											placeholder="Enter date from"
											required
											disabled
										/>
									</FormRow>
									<FormRow label="Date to:" required>
										<FormInput
											control={control}
											name="dateTo"
											inputProps={{
												type: 'date',
											}}
											placeholder="Enter date to"
											required
											disabled
										/>
									</FormRow>
									<FormRow label="Active:">
										<FormSwitch disabled control={control} name="is_active" />
									</FormRow>
								</>
							)}
						</PageCardForm>

						<PageCardFooter mt={6}>
							{id && (
								<Button
									// isLoading={createLoading || updateLoading}
									type="submit"
									ml="auto"
									// isDisabled={!!id}
								>
                  Save
								</Button>
							)}
						</PageCardFooter>
					</PageCard>
				</Flex>
			</Page>
		</form>
	);
};
export default InfulancersDetailPage;
