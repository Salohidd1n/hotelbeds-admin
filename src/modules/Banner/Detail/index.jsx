import { Button, Flex, Grid, Heading, IconButton } from '@chakra-ui/react';
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
import FormImageUpload from 'components/FormElements/ImageUpload/FormImageUpload';
import FormTextarea from 'components/FormElements/Input/FormTextarea';
import FormSwitch from 'components/FormElements/Switch/FormSwitch';
import {
	useBannerCreate,
	useBannerUpdate,
	useGetBannerById,
} from 'services/banner.service';

const BannerDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			is_active: true,
			link_button: {
				is_active: true,
			},
		},
	});

	const { isLoading } = useGetBannerById({
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

	const { mutate: create, isLoading: createLoading } = useBannerCreate({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});
	const { mutate: update, isLoading: updateLoading } = useBannerUpdate({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});

	const onSubmit = (values) => {
		if (!id)
			create({
				...values,
			});
		else {
			update({
				id,
				data: {
					...values,
				},
			});
		}
	};

	if (isLoading) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Banner</HeaderTitle>
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
								<Heading fontSize="xl">Banner Data</Heading>
							</HeaderLeftSide>
						</PageCardHeader>

						<PageCardForm p={6} spacing={8}>
							<FormRow label="Title (EN):" required>
								<FormInput
									control={control}
									name="en_title"
									placeholder="Enter title"
									autoFocus
									required
								/>
							</FormRow>
							<FormRow label="Title (KR):" required>
								<FormInput
									control={control}
									name="kr_title"
									placeholder="Enter title"
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
							<FormRow label="Active:">
								<FormSwitch control={control} name="is_active" />
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

							<FormRow label="Link Text (EN):">
								<FormInput
									control={control}
									name="link_button.en"
									placeholder="Enter text"
								/>
							</FormRow>
							<FormRow label="Link Text (KR):">
								<FormInput
									control={control}
									name="link_button.kr"
									placeholder="Enter text"
								/>
							</FormRow>
							<FormRow label="Link url:">
								<FormTextarea
									control={control}
									name="link_button.url"
									placeholder="Enter url"
								/>
							</FormRow>
							<FormRow label="Link is Active:">
								<FormSwitch control={control} name="link_button.is_active" />
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
export default BannerDetailPage;
