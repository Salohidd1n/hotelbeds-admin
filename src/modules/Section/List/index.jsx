import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton } from '@chakra-ui/react';
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
import { useGetCountries } from 'services/country.service';
import { useDeleteCountry } from 'services/country.service';
import CustomPopup from 'components/CustomPopup';
import moment from 'moment';
import { useGetSections, useSectionsDelete } from 'services/section.service';

const SectionListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [pageSize, setPageSize] = useState(30);
	const [searchParams, setSearchParams] = useSearchParams();
	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
	const [term, setTerm] = useState();
	const [deletableCountry, setDeletableCountry] = useState(null);

	const { data, isLoading, refetch } = useGetSections({
		params: {
			page,
			page_size: pageSize,
			search: term,
		},
	});

	const onChangeTerm = useDebounce((e) => {
		setTerm(e.target.value);
	}, 700);

	const { mutate: deleteCountry, isLoading: deleteLoading } = useSectionsDelete(
		{
			onSuccess: () => {
				refetch();
				setDeletableCountry(null);
			},
		},
	);

	const navigateToCreatePage = () => {
		navigate(`${pathname}/create`);
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
			title: 'Name EN',
			dataIndex: 'en_title',
			render: (_, row) => decodeURIComponent(escape(atob(row.en_title))),
		},
		{
			title: 'Name KR',
			dataIndex: 'kr_title',
			render: (_, row) => decodeURIComponent(escape(atob(row.kr_title))),
		},
		{
			title: 'Template',
			dataIndex: 'template',
		},

		{
			title: 'Order',
			dataIndex: 'order',
		},
		{
			title: '',
			width: 50,
			align: 'center',
			render: (_, row, index) => (
				<IconButton
					onClick={(e) => {
						e.stopPropagation();
						setDeletableCountry(row);
					}}
					colorScheme="red"
					variant="outline"
				>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	return (
		<>
			<Box>
				<Header>
					<HeaderLeftSide>
						<HeaderTitle>Sections</HeaderTitle>
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
                  Add section
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
									onClick: () => navigateToEditPage(row.id),
								})}
								className={styles.table}
							/>
						</Box>
					</PageCard>
				</Page>
			</Box>
			<CustomPopup
				isOpen={!!deletableCountry}
				title="Delete Section"
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
				<p>Are you sure want to delete section?</p>
			</CustomPopup>
		</>
	);
};
export default SectionListPage;
