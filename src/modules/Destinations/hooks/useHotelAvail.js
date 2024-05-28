import useCustomToast from 'hooks/useCustomToast';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useCreateSession, useSearchHotels } from 'services/hotel.service';

const __defaultPaxes = [
	{
		roomId: 1,
		passangers: [
			{
				idPax: 1,
				age: 35,
			},
			{
				idPax: 2,
				age: 35,
			},
		],
	},
];

export default function useHotelAvail({ hotelCodes }) {
	const createSession = useCreateSession();
	const { errorToast } = useCustomToast();
	const [sessionId, setSessionId] = useState();

	const { data, isLoading } = useSearchHotels({
		sessionId: sessionId,
		queryParams: {
			enabled: !!sessionId,
		},
	});

	useEffect(() => {
		if (hotelCodes?.length === 0) return;

		const fetchHotels = async () => {
			const payload = {
				paxes: __defaultPaxes,
				language: 'kr',
				nationality: 'KR',
				checkInDate: moment().add(29, 'days').format('yyyy-MM-DD'),
				checkOutDate: moment().add(30, 'days').format('yyyy-MM-DD'),
				hotelCodes: hotelCodes ? hotelCodes : [],
				useCurrency: import.meta.env.VITE_JUNIPER_CURRENCY,
			};

			createSession.mutate(payload, {
				onSuccess: (res) => {
					setSessionId(res.data.search_session_id);
				},
				onError: () => {
					errorToast('No availability was found');
				},
			});
		};

		fetchHotels();
	}, [JSON.stringify(hotelCodes)]);

	return {
		hotels: data?.data?.hotels,
		isLoading: isLoading || createSession.isLoading,
	};
}
