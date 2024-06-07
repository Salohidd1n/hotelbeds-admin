import { useEffect, useState } from 'react';
import { tripAdvisorServices } from 'services/tripAdvisor.service';

const uniqueLocations = (locations) =>
	locations.filter(
		(location, index, self) =>
			index ===
      self.findIndex(
      	(loc) =>
      		loc.locationDetails.latitude === location.locationDetails.latitude &&
          loc.locationDetails.longitude === location.locationDetails.longitude,
      ),
	);

export default function useRestaurants({
	hotels,
	onChangeNearbyHotels,
	postalCode,
}) {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const getRestaurants = async () => {
			setIsLoading(true);
			const hotel = hotels[0];
			const nearbyPlaces = await tripAdvisorServices.getNearbyPlaces({
				category: 'restaurants',
				latLong: [hotel?.source?.Latitude, hotel?.source?.Longitude].join(','),
			});

			const nearbyObject = await tripAdvisorServices.getNearestObjects({
				searchQuery: hotel.source.en_name,
				language: 'ko',
				category: 'hotels',
				latLong: [hotel?.source?.Latitude, hotel?.source?.Longitude].join(','),
			});

			const currentHotelTripadvisorPlace =
        nearbyObject?.data?.data?.find(
        	(place) => place.address_obj.postalcode === postalCode,
        ) || nearbyObject?.data?.data?.[0];

			let hotelLocationDetails = null;
			if (currentHotelTripadvisorPlace?.location_id) {
				hotelLocationDetails = await tripAdvisorServices.getLocationDetails(
					currentHotelTripadvisorPlace.location_id,
				);
			}

			const restaurants = await Promise.all(
				nearbyPlaces?.data?.data?.map(async (item) => {
					const _photos = await tripAdvisorServices.getLocationPhotos(
						item.location_id,
					);

					const _details = await tripAdvisorServices.getLocationDetails(
						item.location_id,
					);

					return {
						nearbyPlace: item,
						photos: _photos?.data?.data || [],
						locationDetails: _details?.data,
					};
				}),
			);

			onChangeNearbyHotels(
				hotel?.source?.attributes?.JPCode,
				uniqueLocations(restaurants),
				Number(hotelLocationDetails?.data?.rating || 0),
				Number(hotelLocationDetails?.data?.num_reviews || 0),
			);

			setIsLoading(false);
		};
		if (hotels?.length > 0 && postalCode) getRestaurants();
	}, [JSON.stringify(hotels), postalCode]);

	return {
		isLoading,
	};
}
