import { Button, Heading } from '@chakra-ui/react';
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
import ImageUpload from 'components/FormElements/ImageUpload/FormImageUpload';
import {
	useGetLocationsById,
	useLocationsCreate,
	useLocationsUpdate,
} from 'services/location.service';

const LocationDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit } = useForm();

	const { isLoading } = useGetLocationsById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => {
				console.log(res);
				reset({
					...res.data,
					'locations-image': res.data.imageURL,
				});
			},
		},
	});

	const { mutate: createLocation, isLoading: createLoading } =
    useLocationsCreate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });
	const { mutate: updateLocation, isLoading: updateLoading } =
    useLocationsUpdate({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	const onSubmit = (values) => {
		if (!id) createLocation(values);
		else {
			updateLocation({
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
					<HeaderTitle>Locations</HeaderTitle>
				</HeaderLeftSide>
				<HeaderExtraSide>
					<NotificationMenu />
					<ProfileMenu />
				</HeaderExtraSide>
			</Header>

			<Page p={4} h="calc(100vh - 56px)">
				<PageCard w={600}>
					<PageCardHeader>
						<HeaderLeftSide>
							<Heading fontSize="xl">Locations Data</Heading>
						</HeaderLeftSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						<FormRow label="KR title:" required>
							<FormInput
								control={control}
								name="kr_title"
								placeholder="Enter KR title"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="EN title:" required>
							<FormInput
								control={control}
								name="en_title"
								placeholder="Enter EN title"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="Order:" required>
							<FormNumberInput
								control={control}
								name="order"
								placeholder="Enter order"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="Is Active:">
							<FormSwitch control={control} name="is_active" />
						</FormRow>
						<FormRow label="Image:" required>
							<ImageUpload control={control} name="imageURL" required />
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
export default LocationDetailPage;
