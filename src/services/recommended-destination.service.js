import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const destinationService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/recommended-destinations', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/recommended-destinations/${id}`, {
			params,
		}),
	getByLocationId: (id, params) =>
		httpRequestV2.get(
			`v1/promotions/recommended-destinations/by-location/${id}`,
			{
				params,
			},
		),
	update: (data) =>
		httpRequestV2.put(
			`v1/promotions/recommended-destinations/${data.id}`,
			data.data,
		),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/recommended-destinations/${id}`, {
			params,
		}),
	create: (data) =>
		httpRequestV2.post('v1/promotions/recommended-destinations', data),
};

export const useGetRecommendedDestinations = ({
	params = {},
	queryParams,
} = {}) => {
	return useQuery(
		['useGetRecommendedDestinations', params],
		() => {
			return destinationService.getList(params);
		},
		queryParams,
	);
};

export const useGetRecommendedDestinationsById = ({
	id,
	params = {},
	queryParams,
}) => {
	return useQuery(
		['useGetRecommendedDestinationsById', { id, ...params }],
		() => {
			return destinationService.getById(id, params);
		},
		queryParams,
	);
};

export const useGetRecommendedDestinationsByLocationId = ({
	id,
	params = {},
	queryParams,
}) => {
	return useQuery(
		['useGetRecommendedDestinationsByLocationId', { id, ...params }],
		() => {
			return destinationService.getByLocationId(id, params);
		},
		queryParams,
	);
};

export const useRecommendedDestinationsCreate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.create(data),
		mutationSettings,
	);
};

export const useRecommendedDestinationsUpdate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.update(data),
		mutationSettings,
	);
};

export const useRecommendedDestinationsDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => destinationService.delete(id, params),
		mutationSettings,
	);
};

export default destinationService;
