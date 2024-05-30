import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton, Image } from '@chakra-ui/react';
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
	useDestinationsDelete,
	useGetDestinations,
} from 'services/destination.service';
import { useGetRecommendedDestinations } from 'services/recommended-destination.service';

const DestinationListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [pageSize, setPageSize] = useState(30);
	const [page, setPage] = useState(1);
	const [deletableItem, setDeletableItem] = useState(false);
	const [term, setTerm] = useState();
	const { data, isLoading, refetch } = useGetDestinations({
		params: {
			page,
			limit: pageSize,
			search: term,
			populate: 'locationId,groupDestinationId',
		},
	});

	const onChangeTerm = useDebounce((e) => {
		setTerm(e.target.value);
	}, 700);

	const { mutate: deleteZones, isLoading: deleteLoading } =
    useDestinationsDelete({
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
		deleteZones(row._id);
	};

	const recommendedDestinations = useGetRecommendedDestinations({
		params: {
			page: 1,
			limit: 1000,
		},
	});

	const getRecommendedDestinationTitleById = (id) => {
		const title = recommendedDestinations?.data?.data?.results?.find(
			(item) => item._id === id,
		)?.header[0]?.kr_headerTitle;
		return title || '';
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
			title: 'Location',
			render: (_, row) => row?.parent?.locationId.kr_title,
		},
		{
			title: 'Recommended Destination',
			render: (_, row) =>
				getRecommendedDestinationTitleById(
					row?.parent?.recommendedDestinationId,
				),
		},
		{
			title: 'EN title',
			render: (_, row) => row?.header?.en_title,
		},
		{
			title: 'KR title',
			render: (_, row) => row?.header?.kr_title,
		},
		{
			title: 'Image',
			width: 80,
			render: (_, row, index) => (
				<Image
					src={row?.header?.imagesURL[0]}
					w="100%"
					h="100%"
					objectFit="cover"
				></Image>
			),
		},
		{
			title: '',
			width: 50,
			align: 'center',
			render: (_, row) => (
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
						<HeaderTitle>Group destinations</HeaderTitle>
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
									onClick: () => navigateToEditPage(row._id),
								})}
								className={styles.table}
							/>
						</Box>
					</PageCard>
				</Page>
			</Box>
			<CustomPopup
				isOpen={!!deletableItem}
				title="Delete Destination"
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
          Are you sure want to delete <b>{deletableItem?.header?.en_title}</b>{' '}
          group destination?
					<br />
				</p>
			</CustomPopup>
		</>
	);
};
export default DestinationListPage;
