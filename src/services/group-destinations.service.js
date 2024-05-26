import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const destinationService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/group-card-destinations', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/group-card-destinations/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(
			`v1/promotions/group-card-destinations/${data.id}`,
			data.data,
		),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/group-card-destinations/${id}`, {
			params,
		}),
	create: (data) =>
		httpRequestV2.post('v1/promotions/group-card-destinations', data),
};

export const useGetGroupDestinations = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['useGetGroupDestinations', params],
		() => {
			return destinationService.getList(params);
		},
		queryParams,
	);
};

export const useGetGroupDestinationsById = ({
	id,
	params = {},
	queryParams,
}) => {
	return useQuery(
		['useGetGroupDestinationsById', { id, ...params }],
		() => {
			return destinationService.getById(id, params);
		},
		queryParams,
	);
};

export const useGroupDestinationsCreate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.create(data),
		mutationSettings,
	);
};

export const useGroupDestinationsUpdate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.update(data),
		mutationSettings,
	);
};

export const useGroupDestinationsDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => destinationService.delete(id, params),
		mutationSettings,
	);
};

export default destinationService;
