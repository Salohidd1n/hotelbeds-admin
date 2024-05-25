import { useMutation, useQuery } from 'react-query';
import httpRequest from './httpRequest';

const roomService = {
	getList: (params) =>
		httpRequest.get('v1/room-lists', {
			params,
		}),
	getById: (id, params) => httpRequest.get(`v1/room-lists/${id}`, { params }),
	update: (data) => httpRequest.patch('v1/room-lists', data),
	delete: (id, params) => httpRequest.delete(`v1/room-lists/${id}`, { params }),
	create: (data) => httpRequest.post('v1/room-lists', data),
};

export const useGetRooms = ({ params = {}, queryParams } = {}) => {
	return useQuery(
		['GET_ROOMS', params],
		() => {
			return roomService.getList(params);
		},
		queryParams,
	);
};

export const useGetRoomsById = ({ id, params = {}, queryParams }) => {
	return useQuery(
		['GET_ROOMS_BY_ID', { id, ...params }],
		() => {
			return roomService.getById(id, params);
		},
		queryParams,
	);
};

export const useRoomsCreate = (mutationSettings) => {
	return useMutation((data) => roomService.create(data), mutationSettings);
};

export const useRoomsUpdate = (mutationSettings) => {
	return useMutation((data) => roomService.update(data), mutationSettings);
};

export const useRoomsDelete = (mutationSettings, params) => {
	return useMutation((id) => roomService.delete(id, params), mutationSettings);
};

export default roomService;
