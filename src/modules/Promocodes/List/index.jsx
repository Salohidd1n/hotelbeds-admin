import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton, Image } from '@chakra-ui/react';
import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DataTable from '../../../components/DataTable';
import Header, {
	HeaderExtraSide,
	HeaderLeftSide,
	HeaderTitle,
} from '../../../components/Header';
import NotificationMenu from '../../../components/NotificationMenu';
import { Page } from '../../../components/Page';
import PageCard, { PageCardHeader } from '../../../components/PageCard';
import ProfileMenu from '../../../components/ProfileMenu';
import styles from './index.module.scss';
import SearchInput from 'components/FormElements/Input/SearchInput';
import useDebounce from 'hooks/useDebounce';
import CustomPopup from 'components/CustomPopup';
import {
	useGetPromocodes,
	usePromocodesDelete,
} from 'services/promocodes.service';
import { useGetPromocodeTypes } from 'services/promocodeType.service';
import FormSelect from 'components/FormElements/Select/FormSelect';
import { Select } from 'chakra-react-select';

const PromocodeListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [pageSize, setPageSize] = useState(30);
	const [searchParams, setSearchParams] = useSearchParams();
	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
	const [term, setTerm] = useState();
	const [deletableCountry, setDeletableCountry] = useState(null);
	const [promocodeType, setPromocodeType] = useState(null);
	const { data, isLoading, refetch } = useGetPromocodes({
		params: {
			page,
			limit: pageSize,
			search: term,
			populate: 'promocodeTypeId',
			promocodeTypeId: promocodeType,
		},
	});

	const onChangeTerm = useDebounce((e) => {
		setTerm(e.target.value);
	}, 700);

	const { mutate: deleteCountry, isLoading: deleteLoading } =
    usePromocodesDelete({
    	onSuccess: () => {
    		refetch();
    		setDeletableCountry(null);
    	},
    });

	const { data: promocodeTypes } = useGetPromocodeTypes({
		params: {
			page: 1,
			page_size: 1000,
		},
		queryParams: {
			select: (res) => {
				return res.data.results.map((value) => ({
					label: value.type,
					value: value.id,
				}));
			},
		},
	});

	const navigateToCreatePage = (isMultiple = false) => {
		navigate(`${pathname}/create${isMultiple ? '?type=multiple' : ''}`);
	};

	const onChangePage = (current) => {
		setSearchParams({
			page: current,
		});
	};

	const navigateToEditPage = (id) => {
		navigate(`${pathname}/${id}`);
	};

	const onDeleteClick = (e, row) => {
		e.stopPropagation();
		deleteCountry(row.id);
	};

	const columns = [
		{
			title: 'No',
			width: 40,
			textAlign: 'center',
			align: 'center',
			// render: (_, __, index) => (page - 1) * pageSize + index + 1,
			render: (_, row, index) => (
				<Box bg={row.valid ? 'transparent' : '#fef2f2'} p="12px 8px">
					{(page - 1) * pageSize + index + 1}
				</Box>
			),
		},
		{
			title: 'Code',
			dataIndex: 'code',
			render: (_, row) => (
				<Box bg={row.valid ? 'transparent' : '#fef2f2'} p="12px 8px">
					{row.code}
				</Box>
			),
		},
		{
			title: 'Value',
			dataIndex: 'value',
			render: (_, row) => (
				<Box bg={row.valid ? 'transparent' : '#fef2f2'} p="12px 8px">
					{row.value}
				</Box>
			),
		},
		{
			title: 'Type',
			render: (_, row) => (
				<Box bg={row.valid ? 'transparent' : '#fef2f2'} p="12px 8px">
					{row.promocodeTypeId.type}
				</Box>
			),
		},
		{
			title: 'Date from',
			render: (_, row) => (
				<Box bg={row.valid ? 'transparent' : '#fef2f2'} p="12px 8px">
					{row.dateFrom.split('T')[0]}
				</Box>
			),
		},
		{
			title: 'Date To',
			render: (_, row) => (
				<Box bg={row.valid ? 'transparent' : '#fef2f2'} p="12px 8px">
					{row.dateTo.split('T')[0]}
				</Box>
			),
		},
		// {
		//   title: '',
		//   width: 50,
		//   align: 'center',
		//   render: (_, row, index) => (
		//     <IconButton
		//       onClick={(e) => {
		//         e.stopPropagation()
		//         setDeletableCountry(row)
		//       }}
		//       colorScheme='red'
		//       variant='outline'
		//     >
		//       <DeleteIcon />
		//     </IconButton>
		//   )
		// }
	];

	return (
		<>
			<Box>
				<Header>
					<HeaderLeftSide>
						<HeaderTitle>Promocodes</HeaderTitle>
					</HeaderLeftSide>
					<HeaderExtraSide>
						<NotificationMenu />
						<ProfileMenu />
					</HeaderExtraSide>
				</Header>

				<Page p={4}>
					<PageCard h="calc(100vh - 90px)">
						<PageCardHeader>
							<HeaderLeftSide>
								<Select
									options={promocodeTypes}
									value={promocodeTypes?.find(
										(option) => option.value === promocodeType,
									)}
									onChange={(val) => {
										setPromocodeType(val.value);
									}}
									placeholder="Select promocode type"
									menuPortalTarget={document.body}
								/>
							</HeaderLeftSide>
							<HeaderExtraSide>
								<Box w="250px">
									<SearchInput onChange={onChangeTerm} />
								</Box>
								<Button
									onClick={() => navigateToCreatePage(true)}
									bgColor="primary.main"
									leftIcon={<AddIcon />}
								>
                  Create Multiple
								</Button>
								<Button
									onClick={() => navigateToCreatePage()}
									bgColor="primary.main"
									leftIcon={<AddIcon />}
								>
                  Create Single
								</Button>
							</HeaderExtraSide>
						</PageCardHeader>

						<Box p={3}>
							<DataTable
								columns={columns}
								data={data?.data?.results}
								scroll={{ y: 'calc(100vh - 260px)' }}
								isLoading={isLoading}
								pagination={{
									total: Number(data?.data?.totalResults || 0),
									pageSize,
									onPageSizeChange: setPageSize,
									onChange: onChangePage,
									current: page,
								}}
								onRow={(row, index) => ({
									onClick: (e) => {
										const selection = window.getSelection().toString();
										if (selection.length > 0) {
											e.preventDefault();
											return;
										}
										navigateToEditPage(row.id);
									},
								})}
								className={styles.table}
							/>
						</Box>
					</PageCard>
				</Page>
			</Box>
			<CustomPopup
				isOpen={!!deletableCountry}
				title="Delete Markup"
				footerContent={
					<Box display="flex" gap="20px">
						<Button variant="outline" onClick={() => setDeletableCountry(null)}>
              Cancel
						</Button>
						<Button
							variant="solid"
							bg="red"
							disabled={deleteLoading}
							isLoading={deleteLoading}
							onClick={(e) => onDeleteClick(e, deletableCountry)}
							_hover={{
								background: 'red',
							}}
						>
              Delete
						</Button>
					</Box>
				}
				onClose={() => setDeletableCountry(null)}
			>
				<p>Are you sure want to delete Promocode?</p>
			</CustomPopup>
		</>
	);
};
export default PromocodeListPage;
