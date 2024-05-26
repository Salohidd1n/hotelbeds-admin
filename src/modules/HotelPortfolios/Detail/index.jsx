import { Button, Divider, Heading } from '@chakra-ui/react';
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

import {
	useCreateHotelPortfolio,
	useGetSingHotelPortfolio,
	useUpdateHotelPortfolio,
} from 'services/hotel-portfolio.service';
import { useEffect } from 'react';

const HotelPortfoliosDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			user_type: 1,
		},
	});

	const { isLoading, data } = useGetSingHotelPortfolio({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: reset,
		},
	});

	useEffect(() => {
		if (!data) return;

		reset({ ...data, JPCode: data?.attributes?.JPCode });
	}, [data]);

	const { mutate: createUpdatePortfolio, isLoading: createLoading } =
    useCreateHotelPortfolio({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });
	const { mutate: updateHotelPortfolio, isLoading: updateLoading } =
    useUpdateHotelPortfolio({
    	onSuccess: () => {
    		successToast();
    		navigate(-1);
    	},
    });

	const onSubmit = (values) => {
		const payload = {
			...values,
			attributes: { JPCode: values.JPCode, HasSynonyms: 'false' },
			Zone: {
				...values.Zone,
				attributes: {
					JPDCode: values.Zone.attributes.JPDCode,
					Code: values.Zone.attributes.JPDCode,
				},
			},
		};

		if (!id) createUpdatePortfolio(payload);
		else {
			updateHotelPortfolio({
				id,
				data: payload,
			});
		}
	};

	if (isLoading) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Hotel Portfolio</HeaderTitle>
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
							<Heading fontSize="xl">Hotel Portfolio Data</Heading>
						</HeaderLeftSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						<FormRow label="JP code:" required>
							<FormInput
								control={control}
								name="JPCode"
								placeholder="Enter JPCode"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="EN name:" required>
							<FormInput
								control={control}
								name="en_name"
								placeholder="Enter EN name"
								required
							/>
						</FormRow>
						<FormRow label="KR name:" required>
							<FormInput
								control={control}
								name="kr_name"
								placeholder="Enter KR name"
								required
							/>
						</FormRow>

						<Divider />

						<FormRow label="Zone KR name:" required>
							<FormInput
								control={control}
								name="Zone.kr_name"
								placeholder="Enter KR name"
								required
							/>
						</FormRow>

						<FormRow label="Zone EN name:" required>
							<FormInput
								control={control}
								name="Zone.en_name"
								placeholder="Enter KR name"
								required
							/>
						</FormRow>

						<FormRow label="Zone JPD Code:" required>
							<FormInput
								control={control}
								name="Zone.attributes.JPDCode"
								placeholder="Enter JPD Code"
								required
							/>
						</FormRow>

						<FormRow label="EN Address:" required>
							<FormInput
								control={control}
								name="en_address"
								placeholder="Enter EN Address"
								required
							/>
						</FormRow>

						<FormRow label="KR Address:" required>
							<FormInput
								control={control}
								name="kr_address"
								placeholder="Enter KR Address"
								required
							/>
						</FormRow>

						<FormRow label="Zip Code:" required>
							<FormInput
								control={control}
								name="ZipCode"
								placeholder="Enter Zip Code"
								required
							/>
						</FormRow>

						<FormRow label="Latitude:" required>
							<FormInput
								control={control}
								name="Latitude"
								placeholder="Enter Latitude"
								required
							/>
						</FormRow>

						<FormRow label="Longitude:" required>
							<FormInput
								control={control}
								name="Longitude"
								placeholder="Enter Longitude"
								required
							/>
						</FormRow>

						<Divider />

						<FormRow label="Hotel Category Value:" required>
							<FormInput
								control={control}
								name="HotelCategory.value"
								placeholder="Enter Hotel Category Value"
								required
							/>
						</FormRow>

						<FormRow label="Hotel Category Type:" required>
							<FormInput
								control={control}
								name="HotelCategory.attributes.Type"
								placeholder="Enter Hotel Category Type"
								required
							/>
						</FormRow>

						<FormRow label="Hotel Category Code:" required>
							<FormInput
								control={control}
								name="HotelCategory.attributes.Code"
								placeholder="Enter Hotel Category Code"
								required
							/>
						</FormRow>

						<Divider />

						<FormRow label="City EN value:" required>
							<FormInput
								control={control}
								name="City.en_value"
								placeholder="Enter City value"
								required
							/>
						</FormRow>

						<FormRow label="City KR value:" required>
							<FormInput
								control={control}
								name="City.kr_value"
								placeholder="Enter City KR value"
								required
							/>
						</FormRow>

						<FormRow label="City ID:" required>
							<FormInput
								control={control}
								name="City.attributes.Id"
								placeholder="Enter City ID"
								required
							/>
						</FormRow>

						<FormRow label="City JPD Code:" required>
							<FormInput
								control={control}
								name="City.attributes.JPDCode"
								placeholder="Enter City JPD Code"
								required
							/>
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
export default HotelPortfoliosDetailPage;
