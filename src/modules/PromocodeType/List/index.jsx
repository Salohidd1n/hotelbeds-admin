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
	useGetPromocodeTypes,
	usePromocodeTypeDelete,
} from 'services/promocodeType.service';

const PromocodeTypeListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [pageSize, setPageSize] = useState(30);
	const [searchParams, setSearchParams] = useSearchParams();
	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
	const [term, setTerm] = useState();
	const [deletableCountry, setDeletableCountry] = useState(null);

	const { data, isLoading, refetch } = useGetPromocodeTypes({
		params: {
			page,
			limit: pageSize,
			search: term,
		},
	});

	const onChangeTerm = useDebounce((e) => {
		setTerm(e.target.value);
	}, 700);

	const { mutate: deleteCountry, isLoading: deleteLoading } =
    usePromocodeTypeDelete({
    	onSuccess: () => {
    		refetch();
    		setDeletableCountry(null);
    	},
    });

	const navigateToCreatePage = () => {
		navigate('/promocode/types/create');
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
			render: (_, __, index) => (page - 1) * pageSize + index + 1,
		},
		{
			title: 'Type',
			dataIndex: 'type',
		},
		{
			title: 'Description',
			dataIndex: 'description',
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
						<HeaderTitle>Promocode Types</HeaderTitle>
					</HeaderLeftSide>
					<HeaderExtraSide>
						<NotificationMenu />
						<ProfileMenu />
					</HeaderExtraSide>
				</Header>

				<Page p={4}>
					<PageCard h="calc(100vh - 90px)">
						<PageCardHeader>
							<HeaderExtraSide>
								<Box w="250px">
									<SearchInput onChange={onChangeTerm} />
								</Box>
								<Button
									onClick={navigateToCreatePage}
									bgColor="primary.main"
									leftIcon={<AddIcon />}
								>
                  Create
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
									onClick: () => {
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
				<p>Are you sure want to delete Promocode type?</p>
			</CustomPopup>
		</>
	);
};
export default PromocodeTypeListPage;
