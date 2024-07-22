import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const sectionService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/sections', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/sections/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(`v1/promotions/sections/${data.id}`, data.data),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/sections/${id}`, {
			params,
		}),
	create: (data) => httpRequestV2.post('v1/promotions/sections', data),
};

export const useGetSections = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['useGetSections', params],
		() => {
			return sectionService.getList(params);
		},
		queryParams,
	);
};

export const useGetSectionsById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['useGetSectionsById', { id, ...params }],
		() => {
			return sectionService.getById(id, params);
		},
		queryParams,
	);
};

export const useSectionsCreate = (mutationSettings) => {
	return useMutation((data) => sectionService.create(data), mutationSettings);
};

export const useSectionsUpdate = (mutationSettings) => {
	return useMutation((data) => sectionService.update(data), mutationSettings);
};

export const useSectionsDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => sectionService.delete(id, params),
		mutationSettings,
	);
};

export default sectionService;
