import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
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
import SearchInput from 'components/FormElements/Input/SearchInput';
import useDebounce from 'hooks/useDebounce';
import CustomPopup from 'components/CustomPopup';
import {
	useGetUpTargetDestinations,
	useUpTargetDestinationsDelete,
} from 'services/up-target-destinations.service';
import {
	useGetHotelPreview,
	useHotelPreviewDelete,
} from 'services/hotel-preview.service';

const HotelPreviewListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [pageSize, setPageSize] = useState(30);
	const [page, setPage] = useState(1);
	const [deletableItem, setDeletableItem] = useState(false);
	const [term, setTerm] = useState();
	const { data, isLoading, refetch } = useGetHotelPreview({
		params: {
			page,
			limit: pageSize,
			search: term,
			populate: 'sectionId',
		},
	});

	const onChangeTerm = useDebounce((e) => {
		setTerm(e.target.value);
	}, 700);

	const { mutate: deleteDestination, isLoading: deleteLoading } =
    useHotelPreviewDelete({
    	onSuccess: () => {
    		refetch();
    		setDeletableItem(null);
    	},
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
		deleteDestination(row.id);
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
			render: (_, row) => (
				<p
					dangerouslySetInnerHTML={{
						__html: decodeURIComponent(escape(atob(row.sectionId.kr_title))),
					}}
				></p>
			),
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
						setDeletableItem(row);
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
						<HeaderTitle>Hotel preview</HeaderTitle>
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
									onClick: () => navigateToEditPage(row.id),
								})}
								className={styles.table}
							/>
						</Box>
					</PageCard>
				</Page>
			</Box>
			<CustomPopup
				isOpen={!!deletableItem}
				title="Delete Group Destination"
				footerContent={
					<Box display="flex" gap="3">
						<Button variant="outline" onClick={() => setDeletableItem(null)}>
              Cancel
						</Button>
						<Button
							variant="solid"
							bg="red"
							disabled={deleteLoading}
							isLoading={deleteLoading}
							onClick={(e) => onDeleteClick(e, deletableItem)}
							_hover={{
								background: 'red',
							}}
						>
              Delete
						</Button>
					</Box>
				}
				onClose={() => setDeletableItem(null)}
			>
				<p>
          Are you sure want to delete <b>{deletableItem?.en_location}</b> hotel
          preview?
				</p>
			</CustomPopup>
		</>
	);
};
export default HotelPreviewListPage;
