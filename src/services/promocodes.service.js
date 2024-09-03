import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const promocodesService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/promocodes', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/promocodes/${id}`, {
			params,
		}),
	downloadExcel: (id, params) =>
		httpRequestV2.get(`v1/promotions/promocodes/download/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(`v1/promotions/promocodes/${data.id}`, data.data),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/promocodes/${id}`, {
			params,
		}),
	deleteByType: (id, params) =>
		httpRequestV2.delete(`v1/promotions/promocodes/promocode-type/${id}`, {
			params,
		}),
	create: (data) => httpRequestV2.post('v1/promotions/promocodes', data),
	generate: (data) =>
		httpRequestV2.post('v1/promotions/promocodes/generate', data),
};

export const useGetPromocodes = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['useGetPromocodes', params],
		() => {
			return promocodesService.getList(params);
		},
		queryParams,
	);
};

export const useGetPromocodesById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['useGetPromocodesById', { id, ...params }],
		() => {
			return promocodesService.getById(id, params);
		},
		queryParams,
	);
};

export const useDownloadExcel = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['useDownloadExcel', { id, ...params }],
		() => {
			return promocodesService.downloadExcel(id, params);
		},
		queryParams,
	);
};

export const usePromocodesCreate = (mutationSettings) => {
	return useMutation(
		(data) => promocodesService.create(data),
		mutationSettings,
	);
};

export const useGeneratePromocodes = (mutationSettings) => {
	return useMutation(
		(data) => promocodesService.generate(data),
		mutationSettings,
	);
};

export const usePromocodesUpdate = (mutationSettings) => {
	return useMutation(
		(data) => promocodesService.update(data),
		mutationSettings,
	);
};

export const usePromocodesDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => promocodesService.delete(id, params),
		mutationSettings,
	);
};

export const usePromocodesDeleteByType = (mutationSettings, params) => {
	return useMutation(
		(id) => promocodesService.deleteByType(id, params),
		mutationSettings,
	);
};

export default promocodesService;
