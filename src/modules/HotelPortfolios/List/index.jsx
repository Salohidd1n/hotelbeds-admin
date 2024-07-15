import { AddIcon, DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
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
import { useGetHotelPortfolios } from 'services/hotel-portfolio.service';
import { useDeleteHotelPortfolio } from 'services/hotel-portfolio.service';
import CustomPopup from 'components/CustomPopup';
import SearchInput from 'components/FormElements/Input/SearchInput';
import useDebounce from 'hooks/useDebounce';
import moment from 'moment';

const HotelPortfoliosListPage = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [pageSize, setPageSize] = useState(30);
	const [searchParams, setSearchParams] = useSearchParams();
	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
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

	console.log(list);

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
		setSearchParams({
			page: current,
		});
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
			render: (_, row, index) =>
				row[row.translation_options.kr_name] || row.kr_name,
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
			title: 'Updated At',
			dataIndex: 'updated_at',
			render: (_, row, index) =>
				parseInt(row.updated_at) > 0
					? moment.unix(parseInt(row.updated_at)).format('YYYY/MM/DD HH:mm:ss')
					: '',
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
								{/* <Button
									onClick={navigateToCreatePage}
									bgColor="primary.main"
									leftIcon={<AddIcon />}
								>
                  Create Portfolio
								</Button> */}
							</HeaderExtraSide>
						</PageCardHeader>

						<Box p={3}>
							<DataTable
								columns={columns}
								data={list}
								scroll={{ y: 'calc(100vh - 260px)' }}
								isLoading={isLoading || deleteLoading}
								pagination={{
									total: Number(data?.count || 0),
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
