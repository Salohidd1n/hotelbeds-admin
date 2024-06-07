import { useMemo } from 'react';
import {
	useGetLocationDetails,
	useGetNearestObjects,
} from 'services/tripAdvisor.service';

const useReviews = ({
	hotelName,
	hotelLat,
	hotelLng,
	language,
	category = 'hotels',
	postalCode,
	onChange,
	JPCode,
}) => {
	const { data: nearestPlaces } = useGetNearestObjects({
		params: {
			searchQuery: hotelName,
			language: language,
			category: category,
			latLong: [hotelLat, hotelLng].join(','),
		},
		queryParams: {
			enabled: !!hotelName,
		},
	});

	const currentHotelTripadvisorPlace = useMemo(() => {
		return (
			nearestPlaces?.data?.data?.find(
				(place) => place.address_obj.postalcode === postalCode,
			) || nearestPlaces?.data?.data?.[0]
		);
	}, [nearestPlaces, postalCode]);

	const { data: details } = useGetLocationDetails({
		locationId: currentHotelTripadvisorPlace?.location_id,
		queryParams: {
			enabled: !!currentHotelTripadvisorPlace?.location_id,
			onSuccess: (res) => {
				onChange(
					JPCode,
					res?.data?.num_reviews || 0,
					Math.floor(res?.data?.rating || 0),
				);
			},
		},
	});

	return {
		rating: Number(details?.data?.rating || 0),
		reviewsCount: Number(details?.data?.num_reviews || 0),
	};
};

export default useReviews;
