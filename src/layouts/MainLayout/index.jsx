import { Box, Flex } from '@chakra-ui/react';
import Sidebar from '../../components/Sidebar';
import { BiCurrentLocation, BiHome, BiHotel, BiMap } from 'react-icons/bi';
import { IoLocationOutline } from 'react-icons/io5';
import { TbLocation } from 'react-icons/tb';
import { MdModeOfTravel } from 'react-icons/md';
import { Outlet } from 'react-router-dom';
import { MdOutlineDataExploration } from 'react-icons/md';
import { GiTriangleTarget } from 'react-icons/gi';
import { MdDataArray } from 'react-icons/md';
import { AiFillDatabase } from 'react-icons/ai';
import { HiTemplate } from 'react-icons/hi';
import { RiMarkupLine } from 'react-icons/ri';
import { RiCoupon3Fill } from 'react-icons/ri';
import { FaBarcode } from 'react-icons/fa';
import { FaCode } from 'react-icons/fa6';

import { FaQrcode } from 'react-icons/fa';

const elements = [
	// {
	// 	label: 'Dashboard',
	// 	icon: BiHomeSmile,
	// 	link: '/dashboard',
	// },
	{
		label: 'Static Data',
		icon: MdDataArray,
		link: '/static-data',
		children: [
			{
				label: 'Hotel Portfolios',
				icon: BiHome,
				link: '/static-data/hotel-portfolios',
			},
			{
				label: 'Countries',
				icon: BiMap,
				link: '/static-data/countries',
			},
			{
				label: 'Rooms',
				icon: BiHotel,
				link: '/static-data/rooms',
			},
			{
				label: 'Zones',
				icon: BiCurrentLocation,
				link: '/static-data/zones',
			},
		],
	},
	{
		label: 'Sections',
		icon: HiTemplate,
		link: '/section',
	},
	{
		label: 'Banner',
		icon: AiFillDatabase,
		link: '/banner',
	},
	{
		label: 'Promocode',
		icon: RiCoupon3Fill,
		link: '/promocode',
		children: [
			{
				label: 'Types',
				icon: FaQrcode,
				link: '/promocode/types',
			},
			{
				label: 'Codes',
				icon: FaCode,
				link: '/promocode/codes',
			},
		],
	},
	{
		label: 'Locations',
		icon: MdOutlineDataExploration,
		link: '/promotions',
		children: [
			{
				label: 'Location',
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
	{
		label: 'Target',
		icon: GiTriangleTarget,
		link: '/target',
		children: [
			{
				label: 'Special Markups',
				icon: RiMarkupLine,
				link: '/target/markup',
			},
			{
				label: 'Group Cards',
				icon: MdModeOfTravel,
				link: '/target/group-destinations',
			},
			{
				label: 'Group Hotels',
				icon: IoLocationOutline,
				link: '/target/up-target-destinations',
			},
			{
				label: 'Preview Hotels',
				icon: IoLocationOutline,
				link: '/target/hotel-previews',
			},
			// {
			//   label: 'Get closer to the Europe you want to visit',
			//   icon: TbLocation,
			//   link: '/target/down-target-destinations'
			// }
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
