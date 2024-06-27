import { useMutation } from 'react-query';
import httpRequestAuth from './httpRequestAuth';

const authService = {
	login: (data) => httpRequestAuth.post('v1/auth/login', data),
	register: (data) => httpRequestAuth.post('v1/auth/register', data),
	logout: (data) => httpRequestAuth.post('v1/auth/logout', data),
};

export const useLoginMutation = (mutationSettings) => {
	return useMutation((data) => authService.login(data), mutationSettings);
};

export const useRegisterMutation = (mutationSettings) => {
	return useMutation((data) => authService.login(data), mutationSettings);
};

export const useLogoutMutation = (mutationSettings) => {
	return useMutation((data) => authService.logout(data), mutationSettings);
};
