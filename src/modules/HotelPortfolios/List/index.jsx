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

const HotelPortfoliosListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [pageSize, setPageSize] = useState(30);

	const { data, isLoading, refetch } = useGetHotelPortfolios({
		params: {
			page_size: pageSize,
			page: 1,
		},
	});

	const list = data?.hits;

	const { mutate: deleteHotelPortfolio, isLoading: deleteLoading } =
    useDeleteHotelPortfolio({
    	onSuccess: refetch,
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
			dataIndex: 'JPCode',
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
		},
		{
			title: 'City (KR)',
			dataIndex: 'City.kr_value',
		},
		{
			title: '',
			width: 50,
			align: 'center',
			render: (_, row, index) => (
				<IconButton
					onClick={(e) => onDeleteClick(e, row)}
					colorScheme="red"
					variant="outline"
				>
					<DeleteIcon />
				</IconButton>
			),
		},
	];

	return (
		<Box>
			<Header>
				<HeaderLeftSide>
					<HeaderTitle>Пользователи</HeaderTitle>
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
							<Button
								onClick={navigateToCreatePage}
								bgColor="primary.main"
								leftIcon={<AddIcon />}
							>
                Add Hotel Portfolio
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
	);
};
export default HotelPortfoliosListPage;
