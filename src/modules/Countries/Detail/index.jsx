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

import {
	useCreateCountry,
	useGetSingCountry,
	useUpdateCountry,
} from 'services/country.service';
import { useEffect } from 'react';

const CountryDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit } = useForm({
		defaultValues: {
			user_type: 1,
		},
	});

	const { isLoading, data } = useGetSingCountry({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: reset,
		},
	});

	useEffect(() => {
		if (!data) return;

		reset(data);
	}, [data]);

	const { mutate: createCountry, isLoading: createLoading } = useCreateCountry({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});
	const { mutate: updateCountry, isLoading: updateLoading } = useUpdateCountry({
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
					<HeaderTitle>Countries</HeaderTitle>
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
							<Heading fontSize="xl">Country Data</Heading>
						</HeaderLeftSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						<FormRow label="Name EN:" required>
							<FormInput
								control={control}
								name="english_name"
								placeholder="Enter Name"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="Name KR:" required>
							<FormInput
								control={control}
								name="korean_name"
								placeholder="Enter Name"
								required
							/>
						</FormRow>
						<FormRow label="Alpha2 Code:" required>
							<FormInput
								control={control}
								name="alpha2_code"
								placeholder="Enter alpha2 code"
								required
								disabled={!!id}
							/>
						</FormRow>

						<FormRow label="Alpha3 Code:" required>
							<FormInput
								control={control}
								name="alpha3_code"
								placeholder="Enter alpha3 code"
								required
								disabled={!!id}
							/>
						</FormRow>

						<FormRow label="Numeric:" required>
							<FormInput
								control={control}
								name="numeric"
								placeholder="Enter numeric"
								required
								disabled={!!id}
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
export default CountryDetailPage;
