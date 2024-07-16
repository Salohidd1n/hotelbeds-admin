import {
	AddIcon,
	ChevronDownIcon,
	CopyIcon,
	DeleteIcon,
	DownloadIcon,
} from '@chakra-ui/icons';
import {
	Box,
	Button,
	Flex,
	IconButton,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	Tooltip,
} from '@chakra-ui/react';
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
import { FaSortUp } from 'react-icons/fa';
import { FaSortDown } from 'react-icons/fa6';

const tooltipLabels = {
	kr_name: 'Original Korean Name',
	kr_name_oai: 'Korean Name from Open AI translation',
	kr_name_manual: 'Korean Name from Manual Input',
};

const FILTER_TYPES = {
	NAME: 'NAME',
	JPD_CODE: 'JPD_CODE',
	JP_CODE: 'JP_CODE',
};

const filterOptions = [
	{
		label: 'Name',
		value: FILTER_TYPES.NAME,
	},
	{
		label: 'JPD Code',
		value: FILTER_TYPES.JPD_CODE,
	},
	{
		label: 'JP Code',
		value: FILTER_TYPES.JP_CODE,
	},
];

const HotelPortfoliosListPage = () => {
	const navigate = useNavigate();
	const [isCopied, setIsCopied] = useState(null);
	const { pathname } = useLocation();
	const [filterType, setFilterType] = useState(filterOptions[0]);
	const [pageSize, setPageSize] = useState(30);
	const [searchParams, setSearchParams] = useSearchParams();
	const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
	const [deletableHP, setDeletableHP] = useState(false);
	const [term, setTerm] = useState();
	const [sort, setSort] = useState(null);
	const { data, isLoading, refetch } = useGetHotelPortfolios({
		params: {
			page,
			page_size: pageSize,
			search: filterType.value === FILTER_TYPES.NAME ? term : undefined,
			jpd_code: filterType.value === FILTER_TYPES.JPD_CODE ? term : undefined,
			jp_code: filterType.value === FILTER_TYPES.JP_CODE ? term : undefined,
			updated_at: sort === null ? undefined : sort,
		},
	});

	const onChangeFilterType = (value) => {
		setFilterType(value);
	};

	const onChangeSort = (value) => {
		setSort(value);
	};

	const onCopy = (text, index) => {
		navigator.clipboard.writeText(text);
		setIsCopied(index);
		setTimeout(() => {
			setIsCopied(null);
		}, 3000);
	};

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
			render: (_, row, index) => (
				<Box bg={row.updated_at === '0' ? '#f3f4f6' : '#f0fdf4'} p="12px 8px">
					{(page - 1) * pageSize + index + 1}
				</Box>
			),
		},
		{
			title: 'JPCode',
			dataIndex: 'attributes.JPCode',
			render: (_, row, index) => (
				<Box bg={row.updated_at === '0' ? '#f3f4f6' : '#f0fdf4'} p="12px 8px">
					{row.attributes.JPCode}
				</Box>
			),
		},
		{
			title: 'Name (EN)',
			dataIndex: 'en_name',
			render: (_, row, index) => (
				<Box bg={row.updated_at === '0' ? '#f3f4f6' : '#f0fdf4'} p="12px 8px">
					<Flex alignItems="center" justifyContent="space-between">
						<Text textOverflow="ellipsis" overflow="hidden">
							{row.en_name}
						</Text>
						<Tooltip
							p="5px 10px"
							borderRadius="4px"
							label={isCopied === index ? 'Copied!' : 'Copy'}
						>
							<IconButton
								size="medium"
								colorScheme="gray"
								aria-label="Search database"
								icon={
									<CopyIcon
										onClick={(e) => {
											e.stopPropagation();
											onCopy(row.en_name, index);
										}}
										cursor="pointer"
									/>
								}
							/>
						</Tooltip>
					</Flex>
				</Box>
			),
		},
		{
			title: 'Name (KR)',
			dataIndex: 'kr_name',
			render: (_, row, index) => (
				<Tooltip
					p="5px 10px"
					borderRadius="4px"
					label={tooltipLabels[row?.translation_options?.kr_name]}
				>
					<Box bg={row.updated_at === '0' ? '#f3f4f6' : '#f0fdf4'} p="12px 8px">
						<Flex alignItems="center" justifyContent="space-between">
							<Text textOverflow="ellipsis" overflow="hidden">
								{row[row.translation_options.kr_name] || row.kr_name}
							</Text>
							<Tooltip
								p="5px 10px"
								borderRadius="4px"
								label={isCopied === index ? 'Copied!' : 'Copy'}
							>
								<IconButton
									size="medium"
									colorScheme="gray"
									aria-label="Search database"
									icon={
										<CopyIcon
											onClick={(e) => {
												e.stopPropagation();
												onCopy(
													row[row.translation_options.kr_name] || row.kr_name,
													index,
												);
											}}
											cursor="pointer"
										/>
									}
								/>
							</Tooltip>
						</Flex>
					</Box>
				</Tooltip>
			),
		},
		{
			title: 'City (EN)',
			dataIndex: 'City.en_value',
			render: (_, row, index) => (
				<Box bg={row.updated_at === '0' ? '#f3f4f6' : '#f0fdf4'} p="12px 8px">
					{row.City.en_value}
				</Box>
			),
		},
		{
			title: 'City (KR)',
			dataIndex: 'City.kr_value',
			render: (_, row, index) => (
				<Box bg={row.updated_at === '0' ? '#f3f4f6' : '#f0fdf4'} p="12px 8px">
					{row.City.kr_value}
				</Box>
			),
		},
		{
			title: (
				<Flex alignItems="center" justifyContent="space-between">
					<Text>Updated At</Text>
					<Flex flexDirection="column" alignItems="center">
						<FaSortUp
							onClick={() => onChangeSort(sort === 1 ? null : 1)}
							cursor="pointer"
							fontSize="14px"
							color={sort === 1 && '#007aff'}
						/>
						<FaSortDown
							onClick={() => onChangeSort(sort === -1 ? null : -1)}
							cursor="pointer"
							fontSize="13px"
							color={sort === -1 && '#007aff'}
						/>
					</Flex>
				</Flex>
			),
			dataIndex: 'updated_at',
			render: (_, row, index) => (
				<Box p="12px 8px" bg={row.updated_at === '0' ? '#f3f4f6' : '#f0fdf4'}>
					{parseInt(row.updated_at) > 0
						? moment
							.unix(parseInt(row.updated_at))
							.format('YYYY/MM/DD HH:mm:ss')
						: '-'}
				</Box>
			),
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
							{/* <HeaderLeftSide>
                <Input placeholder='Search by JPD Code' />
              </HeaderLeftSide> */}
							<HeaderExtraSide>
								<Flex alignItems="center" gap="6px">
									<Box w="250px">
										<SearchInput onChange={onChangeTerm} />
									</Box>
									<Menu>
										<MenuButton
											w="106px"
											colorScheme="gray"
											as={Button}
											rightIcon={<ChevronDownIcon />}
											fontWeight={500}
										>
											{filterType.label}
										</MenuButton>
										<MenuList>
											{filterOptions.map((item) => (
												<MenuItem
													onClick={() => onChangeFilterType(item)}
													key={item.value}
													bg={filterType.value === item.value ? 'gray.100' : ''}
													_hover={{
														bg: 'gray.100',
													}}
												>
													{item.label}
												</MenuItem>
											))}
										</MenuList>
									</Menu>
								</Flex>
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
