import { useSearchHotels } from 'services/hotel.service';

export default function useHotelAvail({ hotelCodes }) {
	const { data, isLoading } = useSearchHotels({
		params: {
			jp_codes: hotelCodes,
		},
		queryParams: {
			enabled: !!hotelCodes && hotelCodes?.length > 0,
		},
	});

	return {
		hotels: data?.data?.hits,
		isLoading,
	};
}
