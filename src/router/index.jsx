import { observer } from 'mobx-react-lite';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import Login from '../modules/Login';
import authStore from '../store/auth.store';
import Dashboard from '../modules/Dashboard';
import RoomListPage from 'modules/Rooms/List';
import RoomDetailPage from 'modules/Rooms/Detail';
import ZoneListPage from 'modules/Zones/List';
import ZoneDetailPage from 'modules/Zones/Detail';
import HotelPortfoliosListPage from 'modules/HotelPortfolios/List';
import HotelPortfoliosDetailPage from 'modules/HotelPortfolios/Detail';
import CountriesListPage from 'modules/Countries/List';
import CountryDetailPage from 'modules/Countries/Detail';
import LocationListPage from 'modules/Locations/List';
import LocationDetailPage from 'modules/Locations/Detail';

const Router = () => {
	const { isAuth } = authStore;

	// if (!isAuth)
	// 	return (
	// 		<Routes>
	// 			<Route path="/" element={<AuthLayout />}>
	// 				<Route index element={<Navigate to="/login " />} />
	// 				<Route path="login" element={<Login />} />
	// 				<Route path="*" element={<Navigate to="/login" />} />
	// 			</Route>
	// 			<Route path="*" element={<Navigate to="/login" />} />
	// 		</Routes>
	// 	);

	return (
		<Routes>
			<Route path="/" element={<MainLayout />}>
				<Route index element={<Navigate to="/countries" />} />
				{/* <Route path="dashboard" element={<Dashboard />} /> */}

				<Route path="rooms" element={<RoomListPage />} />
				<Route path="rooms/create" element={<RoomDetailPage />} />
				<Route path="rooms/:id" element={<RoomDetailPage />} />

				<Route path="zones" element={<ZoneListPage />} />
				<Route path="zones/create" element={<ZoneDetailPage />} />
				<Route path="zones/:id" element={<ZoneDetailPage />} />

				<Route path="locations" element={<LocationListPage />} />
				<Route path="locations/create" element={<LocationDetailPage />} />
				<Route path="locations/:id" element={<LocationDetailPage />} />

				<Route path="countries" element={<CountriesListPage />} />
				<Route path="countries/create" element={<CountryDetailPage />} />
				<Route path="countries/:id" element={<CountryDetailPage />} />

				<Route path="hotel-portfolios" element={<HotelPortfoliosListPage />} />
				<Route
					path="hotel-portfolios/create"
					element={<HotelPortfoliosDetailPage />}
				/>
				<Route
					path="hotel-portfolios/:id"
					element={<HotelPortfoliosDetailPage />}
				/>

				<Route path="dashboard" element={<Dashboard />} />
				<Route path="*" element={<Navigate to="/dashboard" />} />
			</Route>

			<Route path="*" element={<Navigate to="/dashboard" />} />
		</Routes>
	);
};

export default observer(Router);
