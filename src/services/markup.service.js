import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const markupService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/special-markups', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/special-markups/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(`v1/promotions/special-markups/${data.id}`, data.data),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/special-markups/${id}`, {
			params,
		}),
	create: (data) => httpRequestV2.post('v1/promotions/special-markups', data),
};

export const useGetMarkups = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['useGetMarkups', params],
		() => {
			return markupService.getList(params);
		},
		queryParams,
	);
};

export const useGetMarkupsById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['useGetMarkupsById', { id, ...params }],
		() => {
			return markupService.getById(id, params);
		},
		queryParams,
	);
};

export const useMarkupCreate = (mutationSettings) => {
	return useMutation((data) => markupService.create(data), mutationSettings);
};

export const useMarkupUpdate = (mutationSettings) => {
	return useMutation((data) => markupService.update(data), mutationSettings);
};

export const useMarkupDelte = (mutationSettings, params) => {
	return useMutation(
		(id) => markupService.delete(id, params),
		mutationSettings,
	);
};

export default markupService;
