import { Box, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import Pagination from 'rc-pagination';
import Table from 'rc-table';
import Filters from './Filters';
import './styles/pagination.scss';
import { HiOutlineInbox } from 'react-icons/hi2';
import { useMemo } from 'react';
import SimpleLoader from '../Loaders/SimpleLoader';

const DataTable = ({
	columns = [],
	data = [],
	scroll,
	pagination,
	isLoading = false,
	...props
}) => {
	const filterRowIsVisible = useMemo(() => {
		return columns.some((column) => column.filterType);
	}, [columns]);

	return (
		<>
			<Box position="relative" borderRight="1px solid" borderColor="border">
				{isLoading && (
					<SimpleLoader
						position="absolute"
						top={'1px'}
						left={'1px'}
						h="calc(100% - 2px)"
						w="calc(100% - 2px)"
						zIndex={100}
						bg="white"
					/>
				)}
				<Table
					columns={columns}
					data={data}
					pagination={true}
					scroll={scroll}
					emptyText={
						<Stack alignItems="center" p={10} spacing={1}>
							<Icon as={HiOutlineInbox} boxSize={20} color="silver" />
							<Text fontSize="md" color="silver" fontWeight={600}>
                Пусто
							</Text>
						</Stack>
					}
					summary={() =>
						filterRowIsVisible && (
							<Table.Summary fixed="top">
								<Table.Summary.Row>
									{columns.map((column, index) => (
										<Table.Summary.Cell key={index}>
											<Filters
												filterType={column.filterType}
												placeholder={column.title}
											/>
										</Table.Summary.Cell>
									))}
								</Table.Summary.Row>
							</Table.Summary>
						)
					}
					{...props}
				/>
			</Box>

			<Flex pt={3} justifyContent="flex-end">
				<Pagination total={0} current={1} {...pagination} />
			</Flex>
		</>
	);
};
export default DataTable;
