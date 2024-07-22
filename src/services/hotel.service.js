import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';
import axios from 'axios';
import generateSignature from 'utils/generateSignature';

export const searchService = {
	createSessiionId: (data) =>
		httpRequestV2.post('v1/search/hotel-availability', data),
	getSessionById: (sessionId) =>
		httpRequestV2.get('v1/search/hotel-availability/' + sessionId),
	getHotelContent: (data) =>
		httpRequestV2.post('v1/search/hotel-content', data),
	searchHotels: (params) => {
		const signature = generateSignature();
		const headers = {};

		headers['x-api-key'] = import.meta.env.VITE_API_KEY;
		headers['x-api-secret'] = signature.key;
		headers['x-timestamp'] = signature.timestamp;
		return axios.get(
			`https://static-api.wafflestay.net/v1/hotel-portfolios?jp_codes=${params.jp_codes}&request.page_size=100`,
			{
				headers: {
					...headers,
				},
			},
		);
	},
};

export const useCreateSession = ({ queryParams } = {}) => {
	return useMutation(searchService.createSessiionId, queryParams);
};

export const useSearchHotels = ({ queryParams, sessionId, params }) => {
	return useQuery(
		['GET_HOTELS', params],
		() => searchService.searchHotels(params),
		queryParams,
	);
};

export const useGetSessionById = ({ queryParams, sessionId, params }) => {
	return useQuery(
		['GET_SESSION_BY_ID', sessionId, params],
		() => searchService.getSessionById(sessionId),
		queryParams,
	);
};

export const useGetHotelContent = () => {
	return useMutation((data) => searchService.getHotelContent(data));
};
