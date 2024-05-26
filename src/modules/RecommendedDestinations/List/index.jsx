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
	useGetRecommendedDestinations,
	useRecommendedDestinationsDelete,
} from 'services/recommended-destination.service';

const RecommendedDestinationListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [pageSize, setPageSize] = useState(30);
	const [page, setPage] = useState(1);
	const [deletableZone, setDeletableZone] = useState(false);
	const [term, setTerm] = useState();
	const { data, isLoading, refetch } = useGetRecommendedDestinations({
		params: {
			page,
			limit: pageSize,
			search: term,
		},
	});

	const onChangeTerm = useDebounce((e) => {
		setTerm(e.target.value);
	}, 700);

	const { mutate: deleteZones, isLoading: deleteLoading } =
    useRecommendedDestinationsDelete({
    	onSuccess: () => {
    		refetch();
    		setDeletableZone(null);
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

	const columns = [
		{
			title: 'No',
			width: 40,
			textAlign: 'center',
			align: 'center',
			render: (_, __, index) => (page - 1) * pageSize + index + 1,
		},
		{
			title: 'Image',
			width: 80,
			render: (_, row, index) => (
				<Image
					src={row?.header[0]?.headerImageURL}
					w="100%"
					h="100%"
					objectFit="cover"
				></Image>
			),
		},
		{
			title: 'EN title',
			render: (_, row, index) => row?.header[0]?.en_headerTitle,
		},
		{
			title: 'KR title',
			render: (_, row, index) => row?.header[0]?.kr_headerTitle,
		},
		{
			title: 'EN content',
			render: (_, row, index) => row?.header[0]?.en_hederContent,
		},
		{
			title: 'KR content',
			render: (_, row, index) => row?.header[0]?.kr_hederContent,
		},
		{
			title: '',
			width: 50,
			align: 'center',
			render: (_, row, index) => (
				<IconButton
					onClick={(e) => {
						e.stopPropagation();
						setDeletableZone(row);
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
						<HeaderTitle>Recommended destinations</HeaderTitle>
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
                  Create recommended destination
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
				isOpen={!!deletableZone}
				title="Delete Travel Destination"
				footerContent={
					<Box display="flex" gap="3">
						<Button variant="outline" onClick={() => setDeletableZone(null)}>
              Cancel
						</Button>
						<Button
							variant="solid"
							bg="red"
							disabled={deleteLoading}
							isLoading={deleteLoading}
							onClick={(e) => onDeleteClick(e, deletableZone)}
							_hover={{
								background: 'red',
							}}
						>
              Delete
						</Button>
					</Box>
				}
				onClose={() => setDeletableZone(null)}
			>
				<p>
          Are you sure want to delete{' '}
					<b>
						{deletableZone?.header && deletableZone?.header[0]?.en_headerTitle}
					</b>{' '}
          travel destinations?
					<br />
          In addition, all child data will be deleted.
				</p>
			</CustomPopup>
		</>
	);
};
export default RecommendedDestinationListPage;
