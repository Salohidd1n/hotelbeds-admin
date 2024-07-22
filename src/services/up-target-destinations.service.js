import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const destinationService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/group-hotel-destinations', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/group-hotel-destinations/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(
			`v1/promotions/group-hotel-destinations/${data.id}`,
			data.data,
		),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/group-hotel-destinations/${id}`, {
			params,
		}),
	create: (data) =>
		httpRequestV2.post('v1/promotions/group-hotel-destinations', data),
};

export const useGetUpTargetDestinations = ({
	params = {},
	queryParams,
} = {}) => {
	return useQuery(
		['useGetUpTargetDestinations', params],
		() => {
			return destinationService.getList(params);
		},
		queryParams,
	);
};

export const useGetUpTargetDestinationsById = ({
	id,
	params = {},
	queryParams,
}) => {
	return useQuery(
		['useGetUpTargetDestinationsById', { id, ...params }],
		() => {
			return destinationService.getById(id, params);
		},
		queryParams,
	);
};

export const useUpTargetDestinationsCreate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.create(data),
		mutationSettings,
	);
};

export const useUpTargetDestinationsUpdate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.update(data),
		mutationSettings,
	);
};

export const useUpTargetDestinationsDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => destinationService.delete(id, params),
		mutationSettings,
	);
};

export default destinationService;
