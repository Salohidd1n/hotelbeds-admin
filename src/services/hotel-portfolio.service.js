import { useMutation, useQuery } from 'react-query';
import httpRequest from './httpRequest';

const hotelProtfolioService = {
	getList: (params) => httpRequest.get('v1/hotel-protfolios', params),
	getByID: (id, params) =>
		httpRequest.get(`v1/hotel-protfolios/${id}`, { params }),
	update: (data) => httpRequest.patch('v1/hotel-protfolios', data),
	delete: (id, params) =>
		httpRequest.delete(`v2/hotel-protfolios/${id}`, { params }),
	create: (data) => httpRequest.post('v1/hotel-protfolios', data),
};

export const useGetHotelPortfolios = ({ params = {}, queryParams = {} }) => {
	return useQuery(
		['HOTEL_PORTFOLIO', params],
		() => hotelProtfolioService.getList(params),
		queryParams,
	);
};

export const useGetSingHotelPortfolio = ({
	params = {},
	queryParams = {},
	id,
}) => {
	return useQuery(
		['HOTEL_PORTFOLIO_SINGLE', params, id],
		() => hotelProtfolioService.getList(id, params),
		queryParams,
	);
};

export const useCreateHotelPortfolio = (mutationSettings) => {
	return useMutation(hotelProtfolioService.create, mutationSettings);
};

export const useUpdateHotelPortfolio = (mutationSettings) => {
	return useMutation(hotelProtfolioService.update, mutationSettings);
};

export const useDeleteHotelPortfolio = (mutationSettings, params) => {
	return useMutation(
		(id) => hotelProtfolioService.delete(id, params),
		mutationSettings,
	);
};

export default hotelProtfolioService;
