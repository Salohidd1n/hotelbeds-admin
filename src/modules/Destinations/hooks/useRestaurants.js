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

export default function useRestaurants({ hotels, onChangeNearbyHotels }) {
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		const getRestaurants = async () => {
			setIsLoading(true);
			const hotel = hotels[0];
			const nearbyPlaces = await tripAdvisorServices.getNearbyPlaces({
				category: 'restaurants',
				latLong: [hotel?.HotelInfo.Latitude, hotel?.HotelInfo.Longitude].join(
					',',
				),
			});

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
				hotel.attributes.JPCode,
				uniqueLocations(restaurants),
			);

			setIsLoading(false);
		};
		if (hotels?.length > 0) getRestaurants();
	}, [JSON.stringify(hotels)]);

	return {
		isLoading,
	};
}
