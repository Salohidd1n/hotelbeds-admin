import { useMutation, useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

export const searchService = {
	createSessiionId: (data) =>
		httpRequestV2.post('v1/search/hotel-availability', data),

	searchHotels: (sessionId, params) =>
		httpRequestV2.get('v1/search/hotel-availability/' + sessionId, {
			params,
		}),
};

export const useCreateSession = ({ queryParams } = {}) => {
	return useMutation(searchService.createSessiionId, queryParams);
};

export const useSearchHotels = ({ queryParams, sessionId, params }) => {
	return useQuery(
		['GET_HOTELS', sessionId, params],
		() => searchService.searchHotels(sessionId, params),
		queryParams,
	);
};
