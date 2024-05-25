import { useMutation, useQuery } from 'react-query';
import httpRequest from './httpRequest';

const roomService = {
	getList: (params) => httpRequest.get('v1/room-list', params),
	getByID: (id, params) => httpRequest.get(`v1/room-list/${id}`, { params }),
	update: (data) => httpRequest.patch('v1/user', data),
	delete: (id, params) => httpRequest.delete(`v2/user/${id}`, { params }),
	create: (data) => httpRequest.post('v1/admin/register', data),
};

// export const useUsersListQuery = ({ params = {}, queryParams } = {}) => {
//   return useQuery(
//     ['USERS', params],
//     () => {
//       return userService.getList(params)
//     },
//     queryParams
//   )
// }

// export const useUserGetByIdQuery = ({ id, params = {}, queryParams }) => {
//   return useQuery(
//     ['USER_BY_ID', { id, ...params }],
//     () => {
//       return userService.getByID(id, params)
//     },
//     queryParams
//   )
// }

// export const useUserCreateMutation = (mutationSettings) => {
//   return useMutation((data) => userService.create(data), mutationSettings)
// }

// export const useUserUpdateMutation = (mutationSettings) => {
//   return useMutation((data) => userService.update(data), mutationSettings)
// }

// export const useUserDeleteMutation = (mutationSettings, params) => {
//   return useMutation((id) => userService.delete(id, params), mutationSettings)
// }

export default roomService;
