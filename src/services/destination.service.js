import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const destinationService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/destinations', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/destinations/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(`v1/promotions/destinations/${data.id}`, data.data),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/destinations/${id}`, {
			params,
		}),
	create: (data) => httpRequestV2.post('v1/promotions/destinations', data),
};

export const useGetDestinations = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['useGetDestinations', params],
		() => {
			return destinationService.getList(params);
		},
		queryParams,
	);
};

export const useGetDestinationsById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['useGetDestinationsById', { id, ...params }],
		() => {
			return destinationService.getById(id, params);
		},
		queryParams,
	);
};

export const useDestinationsCreate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.create(data),
		mutationSettings,
	);
};

export const useDestinationsUpdate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.update(data),
		mutationSettings,
	);
};

export const useDestinationsDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => destinationService.delete(id, params),
		mutationSettings,
	);
};

export default destinationService;
