import { useQuery } from 'react-query';
import httpRequestV2 from './httpRequestV2';

export const tripAdvisorServices = {
	getNearbyPlaces: (params) =>
		httpRequestV2.get('v1/content/tripadvisor/nearby-locations', {
			params,
		}),
	getLocationDetails: (locationId, params) =>
		httpRequestV2.get(`v1/content/tripadvisor/location-details/${locationId}`, {
			params,
		}),
	getLocationPhotos: (locationId, params) =>
		httpRequestV2.get(`v1/content/tripadvisor/location-photos/${locationId}`, {
			params,
		}),
};

export const useGetNearbyPlaces = ({ params = {}, queryParams = {} }) => {
	return useQuery(
		['GET_NEARBY_PLACES', params],
		() => tripAdvisorServices.getNearbyPlaces(params),
		queryParams,
	);
};
