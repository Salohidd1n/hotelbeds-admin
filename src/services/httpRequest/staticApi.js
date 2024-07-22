import axios from 'axios';
import authStore from '../../store/auth.store';
import generateSignature from 'utils/generateSignature';

const httpStaticRequest = axios.create({
	baseURL: import.meta.env.VITE_STATIC_BASE_URL,
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

httpStaticRequest.interceptors.request.use((config) => {
	const token = authStore.token.access;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	const signature = generateSignature();
	config.headers['x-api-key'] = import.meta.env.VITE_API_KEY;
	config.headers['x-api-secret'] = signature.key;
	config.headers['x-timestamp'] = signature.timestamp;
	return config;
});

httpStaticRequest.interceptors.response.use(
	(response) => response.data,
	errorHandler,
);

export default httpStaticRequest;
