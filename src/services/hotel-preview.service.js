import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const destinationService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/preview-hotels', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/preview-hotels/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(`v1/promotions/preview-hotels/${data.id}`, data.data),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/preview-hotels/${id}`, {
			params,
		}),
	create: (data) => httpRequestV2.post('v1/promotions/preview-hotels', data),
};

export const useGetHotelPreview = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['useGetHotelPreview', params],
		() => {
			return destinationService.getList(params);
		},
		queryParams,
	);
};

export const useGetHotelPreviewById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['useGetHotelPreviewById', { id, ...params }],
		() => {
			return destinationService.getById(id, params);
		},
		queryParams,
	);
};

export const useHotelPreviewCreate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.create(data),
		mutationSettings,
	);
};

export const useHotelPreviewUpdate = (mutationSettings) => {
	return useMutation(
		(data) => destinationService.update(data),
		mutationSettings,
	);
};

export const useHotelPreviewDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => destinationService.delete(id, params),
		mutationSettings,
	);
};

export default destinationService;
