import axios from 'axios';
import { standaloneToast } from '../../App';
import authStore from '../../store/auth.store';
import generateSignature from 'utils/generateSignature';

const httpRequestAuth = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL_V2,
	timeout: 100000,
});

const errorHandler = (error, hooks) => {
	// if(error?.response?.status === 401) {
	//   authStore.logout()
	// }

	if (error?.response) {
		console.log('error', error.response);
		if (error.response?.data?.data) {
			standaloneToast({
				title: `REQUEST FAILED (${error.response.status})`,
				description: JSON.stringify(error.response.data.data),
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top-right',
			});
		} else {
			standaloneToast({
				title: 'REQUEST FAILED',
				// description: `Status code: ${error.response.status}`,
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top-right',
			});
		}
	} else {
		standaloneToast({
			title: 'REQUEST FAILED',
			description: '',
			status: 'error',
			duration: 3000,
			isClosable: true,
			position: 'top-right',
		});
	}

	return Promise.reject(error.response);
};

httpRequestAuth.interceptors.request.use((config) => {
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

httpRequestAuth.interceptors.response.use(
	(response) => response.data.data,
	errorHandler,
);

export default httpRequestAuth;
