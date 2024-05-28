import { useMutation, useQuery } from 'react-query';
import httpRequest from './httpRequest';

const countryService = {
	getList: (params) => httpRequest.get('v1/country', { params }),
	getByID: (id, params) => httpRequest.get(`v1/country/${id}`, { params }),
	update: ({ id, data }) => httpRequest.put(`v1/country/${id}`, data),
	delete: (id, params) => httpRequest.delete(`v1/country/${id}`, { params }),
	create: (data) => httpRequest.post('v1/country', data),
};

export const useGetCountries = ({ params = {}, queryParams = {} }) => {
	return useQuery(
		['COUNTRY', params],
		() => countryService.getList(params),
		queryParams,
	);
};

export const useGetSingCountry = ({ params = {}, queryParams = {}, id }) => {
	return useQuery(
		['COUNTRY_SINGLE', params, id],
		() => countryService.getByID(id, params),
		queryParams,
	);
};

export const useCreateCountry = (mutationSettings) => {
	return useMutation(countryService.create, mutationSettings);
};

export const useUpdateCountry = (mutationSettings) => {
	return useMutation(countryService.update, mutationSettings);
};

export const useDeleteCountry = (mutationSettings, params) => {
	return useMutation(
		(id) => countryService.delete(id, params),
		mutationSettings,
	);
};

export default countryService;
