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
import {
	useUserDeleteMutation,
	useUsersListQuery,
} from '../../../services/user.service';
import styles from './index.module.scss';

const HotelPortfoliosListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [pageSize, setPageSize] = useState(30);

	const {
		data: { users, count } = {},
		isLoading,
		refetch,
	} = useUsersListQuery();

	const { mutate: deleteUser, isLoading: deleteLoading } =
    useUserDeleteMutation({
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
		deleteUser(row.id);
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
			title: 'Имя',
			dataIndex: 'first_name',
		},
		{
			title: 'Фамилия',
			dataIndex: 'last_name',
		},
		{
			title: 'Pinfl',
			dataIndex: 'pinfl',
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
							<Button variant="outline" leftIcon={<DownloadIcon />}>
                Скачать
							</Button>
							<Button
								onClick={navigateToCreatePage}
								bgColor="primary.main"
								leftIcon={<AddIcon />}
							>
                Добавить пользователя
							</Button>
						</HeaderExtraSide>
					</PageCardHeader>

					<Box p={3}>
						<DataTable
							columns={columns}
							data={users}
							scroll={{ y: 'calc(100vh - 260px)' }}
							isLoading={isLoading || deleteLoading}
							pagination={{
								total: count,
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
