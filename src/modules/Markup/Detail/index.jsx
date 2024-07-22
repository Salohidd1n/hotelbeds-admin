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
import FormTextarea from 'components/FormElements/Input/FormTextarea';
import FormImageUpload from 'components/FormElements/ImageUpload/FormImageUpload';
import {
	useGetMarkupsById,
	useMarkupCreate,
	useMarkupUpdate,
} from 'services/markup.service';

const MarkupDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit } = useForm();

	const { isLoading } = useGetMarkupsById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => [reset(res.data)],
		},
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
					<HeaderTitle>Markup</HeaderTitle>
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
export default MarkupDetailPage;
