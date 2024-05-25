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
import { useGetRooms, useRoomsDelete } from 'services/room.service';

const RoomListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [pageSize, setPageSize] = useState(10);
	const [page, setPage] = useState(1);

	const {
		data: { hits, count } = {},
		isLoading,
		refetch,
	} = useGetRooms({
		params: {
			page,
			page_size: 10,
		},
	});

	const { mutate: deleteUser, isLoading: deleteLoading } = useRoomsDelete({
		onSuccess: refetch,
	});

	const navigateToCreatePage = () => {
		navigate(`${pathname}/create`);
	};

	const onChangePage = (current) => {
		setPage(current);
	};

	const navigateToEditPage = (id) => {
		navigate(`${pathname}/${id}`);
	};

	const onDeleteClick = (e, row) => {
		e.stopPropagation();
		deleteUser(row.id);
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
			title: 'JRCode',
			dataIndex: 'JRCode',
		},
		{
			title: 'EN name',
			dataIndex: 'en_name',
		},
		{
			title: 'KR name',
			dataIndex: 'kr_name',
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
					<HeaderTitle>Rooms</HeaderTitle>
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
                Create room
							</Button>
						</HeaderExtraSide>
					</PageCardHeader>

					<Box p={3}>
						<DataTable
							columns={columns}
							data={hits}
							scroll={{ y: 'calc(100vh - 260px)' }}
							isLoading={isLoading || deleteLoading}
							pagination={{
								total: Number(count || 0),
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
	);
};
export default RoomListPage;
