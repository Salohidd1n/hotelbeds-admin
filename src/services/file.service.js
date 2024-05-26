import { useMutation } from 'react-query';
import httpRequestV2 from './httpRequestV2';

const fileService = {
	uploadImage: (data) => httpRequestV2.post('v1/promotions/upload-image', data),
};

export const useUploadImage = (mutationSettings) => {
	return useMutation((data) => fileService.uploadImage(data), mutationSettings);
};
