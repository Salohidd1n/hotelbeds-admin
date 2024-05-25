import { AddIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { useGetHotelPortfolios } from 'services/hotel-portfolio.service';
import { useDeleteHotelPortfolio } from 'services/hotel-portfolio.service';
import CustomPopup from 'components/CustomPopup';
import SearchInput from 'components/FormElements/Input/SearchInput';
import useDebounce from 'hooks/useDebounce';

const HotelPortfoliosListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [pageSize, setPageSize] = useState(30);
	const [page, setPage] = useState(1);
	const [deletableHP, setDeletableHP] = useState(false);
	const [term, setTerm] = useState();

	const { data, isLoading, refetch } = useGetHotelPortfolios({
		params: {
			page,
			page_size: pageSize,
			search: term,
		},
	});

	const list = data?.hits;

	const onChangeTerm = useDebounce((e) => {
		setTerm(e.target.value);
	}, 700);

	const { mutate: deleteHotelPortfolio, isLoading: deleteLoading } =
    useDeleteHotelPortfolio({
    	onSuccess: () => {
    		refetch();
    		setDeletableHP(null);
    	},
    });

	const navigateToCreatePage = () => {
		navigate(`${pathname}/create`);
	};

	const navigateToEditPage = (id) => {
		navigate(`${pathname}/${id}`);
	};

	const onDeleteClick = (e, row) => {
		e.stopPropagation();
		deleteHotelPortfolio(row.id);
	};

	const onChangePage = (current) => {
		setPage(current);
	};

	const columns = [
		{
			title: 'No',
			width: 40,
			textAlign: 'center',
			align: 'center',
			render: (_, __, index) => index + 1,
		},
		{
			title: 'JPCode',
			dataIndex: 'attributes.JPCode',
			render: (_, row, index) => row.attributes.JPCode,
		},
		{
			title: 'Name (EN)',
			dataIndex: 'en_name',
		},
		{
			title: 'Name (KR)',
			dataIndex: 'kr_name',
		},
		{
			title: 'City (EN)',
			dataIndex: 'City.en_value',
			render: (_, row, index) => row.City.en_value,
		},
		{
			title: 'City (KR)',
			dataIndex: 'City.kr_value',
			render: (_, row, index) => row.City.kr_value,
		},
		{
			title: '',
			width: 50,
			align: 'center',
			render: (_, row, index) => (
				<IconButton
					onClick={(e) => {
						e.stopPropagation();
						setDeletableHP(row);
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
						<HeaderTitle>Hotel Portfolios</HeaderTitle>
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
                  Create Portfolio
								</Button>
							</HeaderExtraSide>
						</PageCardHeader>

						<Box p={3}>
							<DataTable
								columns={columns}
								data={list}
								scroll={{ y: 'calc(100vh - 260px)' }}
								isLoading={isLoading || deleteLoading}
								pagination={{
									total: Number(data?.count),
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
				isOpen={!!deletableHP}
				title="Delete Hotel Portfolio"
				footerContent={
					<Box display="flex" gap="20px">
						<Button variant="outline" onClick={() => setDeletableHP(null)}>
              Cancel
						</Button>
						<Button
							variant="solid"
							bg="red"
							disabled={deleteLoading}
							isLoading={deleteLoading}
							onClick={(e) => onDeleteClick(e, deletableHP)}
							_hover={{
								background: 'red',
							}}
						>
              Delete
						</Button>
					</Box>
				}
				onClose={() => setDeletableHP(null)}
			>
				<p>Are you sure want to delete Hotel Portfolio?</p>
			</CustomPopup>
		</>
	);
};
export default HotelPortfoliosListPage;
