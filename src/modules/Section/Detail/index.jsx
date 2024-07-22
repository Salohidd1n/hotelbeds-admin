import { Button, Grid, Heading } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
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
import FormNumberInput from 'components/FormElements/Input/FormNumberInput';
import FormSelect from 'components/FormElements/Select/FormSelect';
import {
	useGetSectionsById,
	useSectionsCreate,
	useSectionsUpdate,
} from 'services/section.service';

const templates = [
	{
		label: 'Location',
		value: 'location',
	},
	{
		label: 'Group card',
		value: 'group-card',
	},
	{
		label: 'Group hotel',
		value: 'group-hotel',
	},
];

const SectionDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			metaData: {},
		},
	});

	const { isLoading, data } = useGetSectionsById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => reset(res.data),
		},
	});

	const { mutate: createCountry, isLoading: createLoading } = useSectionsCreate(
		{
			onSuccess: () => {
				successToast();
				navigate(-1);
			},
		},
	);
	const { mutate: updateCountry, isLoading: updateLoading } = useSectionsUpdate(
		{
			onSuccess: () => {
				successToast();
				navigate(-1);
			},
		},
	);

	const onSubmit = (values) => {
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
					<HeaderTitle>Section</HeaderTitle>
				</HeaderLeftSide>
				<HeaderExtraSide>
					<NotificationMenu />
					<ProfileMenu />
				</HeaderExtraSide>
			</Header>

			<Page p={4} h="calc(100vh - 64px)">
				<PageCard w={600}>
					<PageCardHeader>
						<HeaderLeftSide>
							<Heading fontSize="xl">Section Data</Heading>
						</HeaderLeftSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						<FormRow label="EN title:" required>
							<FormInput
								control={control}
								name="en_title"
								placeholder="Enter en title"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="KR title:" required>
							<FormInput
								control={control}
								name="kr_title"
								placeholder="Enter kr title"
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
						<FormRow label="Select template:" required>
							<FormSelect
								control={control}
								name="template"
								placeholder="Select template"
								required
								options={templates}
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
			</Page>
		</form>
	);
};
export default SectionDetailPage;
