import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';
import axios from 'axios';

export const searchService = {
	createSessiionId: (data) =>
		httpRequestV2.post('v1/search/hotel-availability', data),

	searchHotels: (params) =>
		axios.get(
			`https://static-api.wafflestay.net/v1/hotel-portfolios?jp_codes=${params.jp_codes}&request.page_size=100`,
		),
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
