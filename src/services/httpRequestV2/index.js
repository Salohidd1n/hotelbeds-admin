import axios from 'axios';
import { standaloneToast } from '../../App';
import authStore from '../../store/auth.store';

const httpRequestV2 = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL_V2,
	timeout: 100000,
});

const errorHandler = (error, hooks) => {
	//   if (error?.response?.status === 401) {
	//     authStore.logout()
	//   }

	if (error?.response) {
		if (error.response?.data) {
			standaloneToast({
				title: `REQUEST FAILED (${error.response.status})`,
				description: JSON.stringify(error.response.data.message),
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

httpRequestV2.interceptors.request.use((config) => {
	//   const token = authStore.token.access_token
	//   if (token) {
	//     config.headers.Authorization = `Bearer ${token}`
	//   }
	return config;
});

httpRequestV2.interceptors.response.use(
	(response) => response.data,
	errorHandler,
);

export default httpRequestV2;
