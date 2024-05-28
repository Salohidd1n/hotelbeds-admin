import { useMutation, useQuery } from 'react-query';
import httpRequest from './httpRequest';

const hotelProtfolioService = {
	getList: (params) =>
		httpRequest.get('v1/hotel-portfolios', {
			params,
		}),
	getByID: (id, params) =>
		httpRequest.get(`v1/hotel-portfolios/${id}`, { params }),
	update: ({ id, data }) => httpRequest.put(`v1/hotel-portfolios/${id}`, data),
	delete: (id, params) =>
		httpRequest.delete(`v1/hotel-portfolios/${id}`, { params }),
	create: (data) => httpRequest.post('v1/hotel-portfolios', data),
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
		() => hotelProtfolioService.getByID(id, params),
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
