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

import {
	useGetPromocodeTypesById,
	usePromocodeTypeCreate,
	usePromocodeTypeUpdate,
} from 'services/promocodeType.service';
import FormNumberInput from 'components/FormElements/Input/FormNumberInput';

const PromocodeTypeDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit, setValue } = useForm();

	const { isLoading } = useGetPromocodeTypesById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => reset({ ...res.data }),
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
    usePromocodeTypeUpdate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	const onSubmit = async (values) => {
		if (values.createdAt) delete values.createdAt;
		if (values.updatedAt) delete values.updatedAt;
		if (values.id) delete values.id;
		if (!id) createCountry(values);
		else {
			updateCountry({
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
					<HeaderTitle>Promocode Type</HeaderTitle>
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
								<Heading fontSize="xl">Promocode Type Data</Heading>
							</HeaderLeftSide>
						</PageCardHeader>

						<PageCardForm p={6} spacing={8}>
							<FormRow label="Type:" required>
								<FormInput
									control={control}
									name="type"
									inputProps={{
										onChange: (e) => {
											if (e.target.value.length <= 5) {
												setValue('type', e.target.value.toUpperCase());
											}
										},
									}}
									placeholder="Enter type"
									autoFocus
									required
								/>
							</FormRow>
							<FormRow label="Value:" required>
								<FormNumberInput
									control={control}
									name="value"
									placeholder="Enter value"
									required
								/>
							</FormRow>
							<FormRow label="Max usage allowed:">
								<FormNumberInput
									control={control}
									name="maxUsageAllowed"
									placeholder="Enter max usage"
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

							<FormRow label="Active:">
								<FormSwitch control={control} name="is_active" />
							</FormRow>
						</PageCardForm>

						<PageCardFooter mt={6}>
							<Button
								isLoading={createLoading || updateLoading}
								type="submit"
								ml="auto"
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
export default PromocodeTypeDetailPage;
