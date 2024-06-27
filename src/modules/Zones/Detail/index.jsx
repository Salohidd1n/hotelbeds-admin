import { Box, Button, Heading } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
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
	useZonesStaticUpdate,
	useZonesUpdate,
} from 'services/zone.service';
import FormSwitch from 'components/FormElements/Switch/FormSwitch';
import FormTags from 'components/FormElements/FormTags';
import TagsInput from 'components/FormElements/FormTags';
import { useState } from 'react';
import FormSelect from 'components/FormElements/Select/FormSelect';

const ZoneDetailPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { successToast } = useCustomToast();

	const { control, reset, handleSubmit, getValues } = useForm();

	const [krTags, setKrTags] = useState([]);
	const [enTags, setEnTags] = useState([]);

	const addKrTag = (val) => setKrTags((prev) => [...prev, val]);
	const removeKrTag = (index) =>
		setKrTags((prev) => prev.filter((_, idx) => idx !== index));

	const addEnTag = (val) => setEnTags((prev) => [...prev, val]);
	const removeEnTag = (index) =>
		setEnTags((prev) => prev.filter((_, idx) => idx !== index));

	const { isLoading } = useGetZonesById({
		id,
		queryParams: {
			cacheTime: false,
			enabled: Boolean(id),
			onSuccess: (res) => {
				reset(res);
				setKrTags(res?.kr_name_synonyms);
				setEnTags(res?.en_name_synonyms);
			},
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
			//   navigate(-1);
		},
	});

	const { mutate: updateStaticZone, isLoading: updateStaticLoading } =
    useZonesStaticUpdate({
    	onSuccess: () => {
    		successToast();
    		// navigate(-1);
    	},
    });

	const handleUpdateStaticZone = () => {
		const values = getValues();
		console.log(values);

		updateStaticZone({
			id,
			...values,
			en_name_synonyms: enTags,
			kr_name_synonyms: krTags,
		});
	};
	const onSubmit = (values) => {
		if (!id)
			createZone({
				...values,
				en_name_synonyms: enTags,
				kr_name_synonyms: krTags,
			});
		else {
			updateZone({
				id,
				...values,
				en_name_synonyms: enTags,
				kr_name_synonyms: krTags,
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

			<Page p={4} h="calc(100vh - 64px)">
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
								disabled={!!id}
							/>
						</FormRow>
						<FormRow label="Parent JPD Code:" required>
							<FormInput
								control={control}
								name="ParentJPDCode"
								placeholder="Enter Parent JPD Code"
								required
								disabled={!!id}
							/>
						</FormRow>
						<FormRow label="Area Type:" required>
							<FormInput
								control={control}
								name="AreaType"
								placeholder="Enter Area Type"
								required
								disabled={!!id}
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
								required
								disabled={!!id}
							/>
						</FormRow>

						<FormRow label="Parent Code:" required>
							<FormInput
								control={control}
								name="ParentCode"
								placeholder="Enter Parent Code"
								required
								disabled={!!id}
							/>
						</FormRow>
						<FormRow label="Name (EN):" required>
							<FormInput
								control={control}
								name="en_name"
								placeholder="Enter EN name"
								required
							/>
						</FormRow>

						<FormRow label="Name (KR):" required>
							<FormInput
								control={control}
								name="kr_name"
								disabled
								placeholder="Enter KR name"
							/>
						</FormRow>

						<FormRow label="Open AI Name (KR):" required>
							<FormInput
								disabled
								control={control}
								name="kr_name_oai"
								placeholder="Enter KR name"
							/>
						</FormRow>

						<FormRow label="Manual Name (KR):" required>
							<FormInput
								control={control}
								name="kr_name_manual"
								placeholder="Enter name"
								required
							/>
						</FormRow>

						<FormRow label="Recommended Translation Option (KR):" required>
							<FormSelect
								control={control}
								name="translatio_options.kr_name"
								placeholder="Select prefered option"
								required
								options={
									[
										{
											value: 'kr_name',
											label: 'Original Korean Name',
										},
										{
											value: 'kr_name_oai',
											label: 'Korean Name from Open AI translation',
										},
										{
											value: 'kr_name_manual',
											label: 'Korean Name from Manual Input',
										},
									] || []
								}
							/>
						</FormRow>

						<FormRow label="Synonyms (KR):">
							<TagsInput
								tags={krTags}
								removeTag={removeKrTag}
								addTag={addKrTag}
							/>
						</FormRow>

						<FormRow label="Synonyms (EN):">
							<TagsInput
								tags={enTags}
								removeTag={removeEnTag}
								addTag={addEnTag}
							/>
						</FormRow>
					</PageCardForm>

					<PageCardFooter mt={6}>
						<Box display="flex" justifyContent="flex-end" gap={3} width="100%">
							<Button
								isLoading={updateStaticLoading}
								type="button"
								ml="auto"
								variant="outlined"
								onClick={handleUpdateStaticZone}
							>
                Sync
							</Button>

							<Button
								isLoading={createLoading || updateLoading}
								type="submit"
								// ml="auto"
							>
                Save
							</Button>
						</Box>
					</PageCardFooter>
				</PageCard>
			</Page>
		</form>
	);
};
export default ZoneDetailPage;
