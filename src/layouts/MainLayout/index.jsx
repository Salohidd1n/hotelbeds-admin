import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../../components/Sidebar';
import styles from './index.module.scss';
import { FiUser, FiUsers } from 'react-icons/fi';
import {
	BiCog,
	BiExtension,
	BiHomeSmile,
	BiMoney,
	BiTask,
} from 'react-icons/bi';
import { Outlet } from 'react-router-dom';

const elements = [
	{
		label: 'Dashboard',
		icon: BiHomeSmile,
		link: '/dashboard',
	},
	{
		label: 'Rooms',
		icon: BiHomeSmile,
		link: '/rooms',
	},
	{
		label: 'Zones',
		icon: BiHomeSmile,
		link: '/zones',
	},
	// {
	// 	label: 'Пользователи',
	// 	icon: FiUser,
	// 	link: '/users',
	// },
];

const MainLayout = () => {
	return (
		<Flex>
			<Sidebar elements={elements} />

			<Box flex={1} overflowX="hidden">
				<Outlet />
			</Box>
		</Flex>
	);
};
export default MainLayout;
