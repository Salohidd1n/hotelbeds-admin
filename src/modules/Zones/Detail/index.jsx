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
	useGetZonesById,
	useZonesCreate,
	useZonesUpdate,
} from 'services/zone.service';
import FormSwitch from 'components/FormElements/Switch/FormSwitch';

const ZoneDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit } = useForm();

	const { isLoading } = useGetZonesById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: reset,
		},
	});

	const { mutate: createZone, isLoading: createLoading } = useZonesCreate({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});
	const { mutate: updateZone, isLoading: updateLoading } = useZonesUpdate({
		onSuccess: () => {
			successToast();
			navigate(-1);
		},
	});

	const onSubmit = (values) => {
		if (!id) createZone(values);
		else {
			updateZone({
				id,
				...values,
			});
		}
	};

	if (isLoading) return <SimpleLoader h="100vh" />;

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Header>
				<HeaderLeftSide>
					<BackButton />
					<HeaderTitle>Zones</HeaderTitle>
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
							<Heading fontSize="xl">Zones Data</Heading>
						</HeaderLeftSide>
					</PageCardHeader>

					<PageCardForm p={6} spacing={8}>
						<FormRow label="JPD Code:" required>
							<FormInput
								control={control}
								name="JPDCode"
								placeholder="Enter JPD Code"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="Parent JPD Code:" required>
							<FormInput
								control={control}
								name="ParentJPDCode"
								placeholder="Enter Parent JPD Code"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="Area Type:" required>
							<FormInput
								control={control}
								name="AreaType"
								placeholder="Enter Area Type"
								autoFocus
								required
							/>
						</FormRow>
						<FormRow label="Searchable:">
							<FormSwitch control={control} name="Searchable" />
						</FormRow>
						<FormRow label="Code:" required>
							<FormInput
								control={control}
								name="Code"
								placeholder="Enter Code"
								autoFocus
								required
							/>
						</FormRow>

						<FormRow label="Parent Code:" required>
							<FormInput
								control={control}
								name="ParentCode"
								placeholder="Enter Parent Code"
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
export default ZoneDetailPage;
