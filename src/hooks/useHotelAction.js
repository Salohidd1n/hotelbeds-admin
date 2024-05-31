import { useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export default function useHotelAction({
	hotelCodes,
	onChange,
	initialFields = {},
}) {
	const fileRef = useRef();
	const onDelete = () => {
		onChange(hotelCodes.filter((item) => !item.checked));
	};

	const uploadFile = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.type.includes('sheet')) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const data = new Uint8Array(e.target.result);
					const workbook = XLSX.read(data, { type: 'array' });
					const sheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[sheetName];
					const json = XLSX.utils.sheet_to_json(worksheet);
					const jpCodes = json.map((item) => ({
						JPCode: item.JPCode,
						...initialFields,
					}));
					let filteredJPCodes = jpCodes.filter(
						(item1) =>
							!hotelCodes.some((item2) => item1.JPCode === item2.JPCode),
					);
					onChange([...hotelCodes, ...filteredJPCodes]);
				};
				reader.readAsArrayBuffer(file);
			}
			if (file.type.includes('csv')) {
				Papa.parse(file, {
					header: true,
					skipEmptyLines: true,
					complete: (result) => {
						const jpCodes = result.data.map((item) => ({
							JPCode: item.JPCode,
							...initialFields,
						}));

						let filteredJPCodes = jpCodes.filter(
							(item1) =>
								!hotelCodes.some((item2) => item1.JPCode === item2.JPCode),
						);

						onChange([...hotelCodes, ...filteredJPCodes]);
					},
					error: (error) => {
						console.error('Error reading CSV file:', error);
					},
				});
			}
		}
		e.target.value = null;
	};

	const selectedHotels = useMemo(
		() => hotelCodes.filter((item) => item.checked),
		[hotelCodes],
	);

	const onSelectAll = () => {
		if (hotelCodes.length === selectedHotels.length) {
			onChange(
				hotelCodes.map((item) => ({
					...item,
					checked: false,
				})),
			);
		} else {
			onChange(
				hotelCodes.map((item) => ({
					...item,
					checked: true,
				})),
			);
		}
	};

	return {
		uploadFile,
		onDelete,
		selectedHotels,
		onSelectAll,
		fileRef,
	};
}
