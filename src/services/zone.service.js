import { useMutation, useQuery } from 'react-query';
import httpRequest from './httpRequest';

const zonesService = {
	getList: (params) =>
		httpRequest.get('v1/zone_lists', {
			params,
		}),
	getById: (id, params) => httpRequest.get(`v1/zone_lists/${id}`, { params }),
	update: (data) => httpRequest.put(`v1/zone_lists/${data.id}`, data),
	delete: (id, params) => httpRequest.delete(`v1/zone_lists/${id}`, { params }),
	create: (data) => httpRequest.post('v1/zone_lists', data),
};

export const useGetZones = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['GET_ZONES', params],
		() => {
			return zonesService.getList(params);
		},
		queryParams,
	);
};

export const useGetZonesById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['GET_ZONES_BY_ID', { id, ...params }],
		() => {
			return zonesService.getById(id, params);
		},
		queryParams,
	);
};

export const useZonesCreate = (mutationSettings) => {
	return useMutation((data) => zonesService.create(data), mutationSettings);
};

export const useZonesUpdate = (mutationSettings) => {
	return useMutation((data) => zonesService.update(data), mutationSettings);
};

export const useZonesDelete = (mutationSettings, params) => {
	return useMutation((id) => zonesService.delete(id, params), mutationSettings);
};

export default zonesService;
