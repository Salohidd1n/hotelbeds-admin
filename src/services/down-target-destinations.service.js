import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const destinationService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/down-target-destinations', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/down-target-destinations/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(
			`v1/promotions/down-target-destinations/${data.id}`,
			data.data,
		),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/down-target-destinations/${id}`, {
			params,
		}),
	create: (data) =>
		httpRequestV2.post('v1/promotions/down-target-destinations', data),
};

export const useGetDownTargetDestinations = ({
	params = {},
	queryParams,
} = {}) => {
	return useQuery(
		['useGetDownTargetDestinations', params],
		() => {
			return destinationService.getList(params);
		},
		queryParams,
	);
};

export const useGetDownTargetDestinationsById = ({
	id,
	params = {},
	queryParams,
}) => {
	return useQuery(
		['useGetDownTargetDestinationsById', { id, ...params }],
		() => {
			return destinationService.getById(id, params);
		},
		queryParams,
	);
};

export const useDownTargetDestinationsCreate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.create(data),
		mutationSettings,
	);
};

export const useDownTargetDestinationsUpdate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.update(data),
		mutationSettings,
	);
};

export const useDownTargetDestinationsDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => destinationService.delete(id, params),
		mutationSettings,
	);
};

export default destinationService;
