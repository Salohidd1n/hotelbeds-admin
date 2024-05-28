import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const bannerService = {
	getList: (params) =>
		httpRequestV2.get('v1/promotions/landing-banners', {
			params,
		}),
	getById: (id, params) =>
		httpRequestV2.get(`v1/promotions/landing-banners/${id}`, {
			params,
		}),
	update: (data) =>
		httpRequestV2.put(`v1/promotions/landing-banners/${data.id}`, data.data),
	delete: (id, params) =>
		httpRequestV2.delete(`v1/promotions/landing-banners/${id}`, {
			params,
		}),
	create: (data) => httpRequestV2.post('v1/promotions/landing-banners', data),
};

export const useGetBanner = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['useGetBanner', params],
		() => {
			return bannerService.getList(params);
		},
		queryParams,
	);
};

export const useGetBannerById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['useGetDestinationsById', { id, ...params }],
		() => {
			return bannerService.getById(id, params);
		},
		queryParams,
	);
};

export const useBannerCreate = (mutationSettings) => {
	return useMutation((data) => bannerService.create(data), mutationSettings);
};

export const useBannerUpdate = (mutationSettings) => {
	return useMutation((data) => bannerService.update(data), mutationSettings);
};

export const useBannerDelete = (mutationSettings, params) => {
	return useMutation(
		(id) => bannerService.delete(id, params),
		mutationSettings,
	);
};

export default bannerService;
