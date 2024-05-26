import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../../components/Sidebar';
import styles from './index.module.scss';
import { FiUser, FiUsers } from 'react-icons/fi';
import {
	BiCog,
	BiCurrentLocation,
	BiExtension,
	BiHome,
	BiHomeSmile,
	BiHotel,
	BiLocationPlus,
	BiMap,
	BiMoney,
	BiTask,
} from 'react-icons/bi';
import { IoLocationOutline } from 'react-icons/io5';
import { TbLocation } from 'react-icons/tb';
import { MdModeOfTravel } from 'react-icons/md';
import { Outlet } from 'react-router-dom';
import { MdOutlineDataExploration } from 'react-icons/md';

const elements = [
	// {
	// 	label: 'Dashboard',
	// 	icon: BiHomeSmile,
	// 	link: '/dashboard',
	// },
	{
		label: 'Hotel Portfolios',
		icon: BiHome,
		link: '/hotel-portfolios',
	},
	{
		label: 'Countries',
		icon: BiMap,
		link: '/countries',
	},
	{
		label: 'Rooms',
		icon: BiHotel,
		link: '/rooms',
	},
	{
		label: 'Zones',
		icon: BiCurrentLocation,
		link: '/zones',
	},
	{
		label: 'Promotions',
		icon: MdOutlineDataExploration,
		link: '/promotions',
		children: [
			{
				label: 'Locations',
				icon: IoLocationOutline,
				link: '/promotions/locations',
			},
			{
				label: 'Travel Destinations',
				icon: MdModeOfTravel,
				link: '/promotions/recommended-destinations',
			},
			{
				label: 'Destinations',
				icon: TbLocation,
				link: '/promotions/destinations',
			},
		],
	},
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
