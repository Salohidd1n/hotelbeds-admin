import axios from 'axios';
import { standaloneToast } from '../../App';
import authStore from '../../store/auth.store';

const httpRequest = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	timeout: 100000,
});

const errorHandler = (error, hooks) => {
	//   if (error?.response?.status === 401) {
	//     authStore.logout()
	//   }

	// if (error?.response) {
	// 	if (error.response?.data?.data) {
	// 		standaloneToast({
	// 			title: `REQUEST FAILED (${error.response.status})`,
	// 			description: JSON.stringify(error.response.data.data),
	// 			status: 'error',
	// 			duration: 3000,
	// 			isClosable: true,
	// 			position: 'top-right',
	// 		});
	// 	} else {
	// 		standaloneToast({
	// 			title: 'REQUEST FAILED',
	// 			// description: `Status code: ${error.response.status}`,
	// 			status: 'error',
	// 			duration: 3000,
	// 			isClosable: true,
	// 			position: 'top-right',
	// 		});
	// 	}
	// } else {
	// 	standaloneToast({
	// 		title: 'REQUEST FAILED',
	// 		description: '',
	// 		status: 'error',
	// 		duration: 3000,
	// 		isClosable: true,
	// 		position: 'top-right',
	// 	});
	// }

	return Promise.reject(error.response);
};

httpRequest.interceptors.request.use((config) => {
	const token = authStore.token.access;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

httpRequest.interceptors.response.use(
	(response) => response.data,
	errorHandler,
);

export default httpRequest;
