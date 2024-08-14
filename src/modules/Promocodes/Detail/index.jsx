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
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
} from 'services/promocodeType.service';
import FormSelect from 'components/FormElements/Select/FormSelect';
import FormNumberInput from 'components/FormElements/Input/FormNumberInput';
import {
	useGeneratePromocodes,
	useGetPromocodesById,
	usePromocodesCreate,
	usePromocodesUpdate,
} from 'services/promocodes.service';
import { useEffect } from 'react';

const PromocodesDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();
	const [searchParams] = useSearchParams();
	const { control, reset, handleSubmit, setValue } = useForm();

	const dateFrom = useWatch({
		control,
		name: 'dateFrom',
	});

	const dateTo = useWatch({
		control,
		name: 'dateTo',
	});

	const promocodeTypeId = useWatch({
		control,
		name: 'promocodeTypeId',
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

	useEffect(() => {
		if (promocodeTypeId) {
			const type = promocodeTypes.find(
				(item) => item.value === promocodeTypeId,
			);
			if (type) setValue('code', type.label);
		}
	}, [promocodeTypeId]);

	const { isLoading } = useGetPromocodesById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) =>
				reset({
					...res.data,
					dateFrom: res.data.dateFrom.split('T')[0],
					dateTo: res.data.dateTo.split('T')[0],
				}),
		},
	});

	const { mutate: createCountry, isLoading: createLoading } =
    usePromocodesCreate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	const { mutate: generatePromocode, isLoading: isLoadingGenerate } =
    useGeneratePromocodes({
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

	const onSubmit = async (values) => {
		if (values.createdAt) delete values.createdAt;
		if (values.updatedAt) delete values.updatedAt;
		if (values.id) delete values.id;
		if (searchParams.get('type') === 'multiple') {
			if (!id) {
				const quantity = values.quantity;
				delete values.quantity;
				generatePromocode({
					quantity,
					promoCodeDetails: {
						...values,
					},
				});
			} else {
				updateCountry({
					id,
					data: values,
				});
			}
		} else {
			if (!id) createCountry(values);
			else {
				updateCountry({
					id,
					data: values,
				});
			}
		}
	};

	if (isLoading) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Promocode</HeaderTitle>
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
								<Heading fontSize="xl">Promocode Data</Heading>
							</HeaderLeftSide>
						</PageCardHeader>

						<PageCardForm p={6} spacing={8}>
							{!id && (
								<FormRow label="Select promocode type:" required>
									<FormSelect
										control={control}
										name="promocodeTypeId"
										placeholder="Select promocode type"
										required
										options={promocodeTypes || []}
										customOnChange={(val) => {
											setValue('value', val.maxValue);
										}}
									/>
								</FormRow>
							)}
							{/* <FormRow label='Code:' required>
                <FormInput
                  control={control}
                  name='code'
                  placeholder='Enter code'
                  required
                />
              </FormRow> */}
							<FormRow label="Value:" required>
								<FormNumberInput
									control={control}
									name="value"
									disabled={
										promocodeTypes?.find(
											(item) => item.value === promocodeTypeId,
										)?.maxValue
									}
									placeholder="Enter value"
									required
								/>
							</FormRow>

							{searchParams.get('type') === 'multiple' && (
								<FormRow label="Quantity:" required>
									<FormNumberInput
										control={control}
										name="quantity"
										placeholder="Enter quantity"
										required
									/>
								</FormRow>
							)}

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
								/>
							</FormRow>

							<FormRow label="Date to:" required>
								<FormInput
									control={control}
									name="dateTo"
									inputProps={{
										type: 'date',
										min: dateFrom,
									}}
									placeholder="Enter date to"
									required
								/>
							</FormRow>

							{/* <FormRow label='Valid:'>
                <FormSwitch control={control} name='valid' />
              </FormRow> */}
						</PageCardForm>

						<PageCardFooter mt={6}>
							<Button
								isLoading={createLoading || updateLoading || isLoadingGenerate}
								type="submit"
								ml="auto"
								isDisabled={!!id}
							>
                Save
							</Button>
						</PageCardFooter>
					</PageCard>
				</Flex>
			</Page>
		</form>
	);
};
export default PromocodesDetailPage;
