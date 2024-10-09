import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const promocodeTypeService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/promocode-types', {
			params,
		}),
	getInfulancers: (params) =>
		httpRequestV2.get('v1/promotions/promocodes/promocode-type', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/promocode-types/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(`v1/promotions/promocode-types/${data.id}`, data.data),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/promocode-types/${id}`, {
			params,
		}),
	create: (data) => httpRequestV2.post('v1/promotions/promocode-types', data),
	sendToEmail: (data) =>
		httpRequestV2.post('v1/promotions/promocodes/infulancer', data),
};

export const useGetInfulancers = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['useGetInfulancers', params],
		() => {
			return promocodeTypeService.getInfulancers(params);
		},
		queryParams,
	);
};

export const useGetPromocodeTypes = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['useGetPromocodeTypes', params],
		() => {
			return promocodeTypeService.getList(params);
		},
		queryParams,
	);
};

export const useGetPromocodeTypesById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['useGetPromocodeTypesById', { id, ...params }],
		() => {
			return promocodeTypeService.getById(id, params);
		},
		queryParams,
	);
};

export const usePromocodeTypeCreate = (mutationSettings) => {
	return useMutation(
		(data) => promocodeTypeService.create(data),
		mutationSettings,
	);
};

export const useSendPromocodeToEmail = (mutationSettings) => {
	return useMutation(
		(data) => promocodeTypeService.sendToEmail(data),
		mutationSettings,
	);
};

export const usePromocodeTypeUpdate = (mutationSettings) => {
	return useMutation(
		(data) => promocodeTypeService.update(data),
		mutationSettings,
	);
};

export const usePromocodeTypeDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => promocodeTypeService.delete(id, params),
		mutationSettings,
	);
};

export default promocodeTypeService;
