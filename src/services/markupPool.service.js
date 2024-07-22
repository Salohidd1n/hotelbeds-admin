import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const markupPoolService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/special-markup-pools', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/special-markup-pools/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(
			`v1/promotions/special-markup-pools/${data.id}`,
			data.data,
		),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/special-markup-pools/${id}`, {
			params,
		}),
	create: (data) =>
		httpRequestV2.post('v1/promotions/special-markup-pools', data),
};

export const useGetMarkupsPool = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['useGetMarkupsPool', params],
		() => {
			return markupPoolService.getList(params);
		},
		queryParams,
	);
};

export const useGetMarkupsPoolById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['useGetMarkupsPoolById', { id, ...params }],
		() => {
			return markupPoolService.getById(id, params);
		},
		queryParams,
	);
};

export const useMarkupPoolCreate = (mutationSettings) => {
	return useMutation(
		(data) => markupPoolService.create(data),
		mutationSettings,
	);
};

export const useMarkupPoolUpdate = (mutationSettings) => {
	return useMutation(
		(data) => markupPoolService.update(data),
		mutationSettings,
	);
};

export const useMarkupPoolDelte = (mutationSettings, params) => {
	return useMutation(
		(id) => markupPoolService.delete(id, params),
		mutationSettings,
	);
};

export default markupPoolService;
