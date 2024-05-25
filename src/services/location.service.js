import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const locationService = {
	getList: (params) =>
		httpRequestV2.get('/v1/promotions/locations', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`/v1/promotions/locations/${id}`, { params }),
	update: (data) =>
		httpRequestV2.put(`/v1/promotions/locations/${data.id}`, data.formData),
	delete: (id, params) =>
		httpRequestV2.delete(`/v1/promotions/locations/${id}`, { params }),
	create: (data) => httpRequestV2.post('/v1/promotions/locations', data),
};

export const useGetLocations = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['GET_LOCATIONS', params],
		() => {
			return locationService.getList(params);
		},
		queryParams,
	);
};

export const useGetLocationsById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['GET_LOCATIONS_BY_ID', { id, ...params }],
		() => {
			return locationService.getById(id, params);
		},
		queryParams,
	);
};

export const useLocationsCreate = (mutationSettings) => {
	return useMutation((data) => locationService.create(data), mutationSettings);
};

export const useLocationsUpdate = (mutationSettings) => {
	return useMutation((data) => locationService.update(data), mutationSettings);
};

export const useLocationssDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => locationService.delete(id, params),
		mutationSettings,
	);
};

export default locationService;
