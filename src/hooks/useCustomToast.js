import { useToast } from '@chakra-ui/react';

const useCustomToast = () => {
	const chakraToast = useToast();

	const toast = (settings = {}) => {
		chakraToast({
			title: 'Success',
			description: 'Successfuly authorized',
			position: 'top-right',
			status: 'success',
			duration: 3000,
			isClosable: true,
			...settings,
		});
	};

	const successToast = (description = '', settings = {}) => {
		chakraToast({
			title: 'Success',
			description: description,
			position: 'top-right',
			status: 'success',
			duration: 3000,
			isClosable: true,
			...settings,
		});
	};

	const errorToast = (description = '', settings = {}) => {
		chakraToast({
			title: 'Error',
			description,
			position: 'top-right',
			status: 'error',
			duration: 3000,
			isClosable: true,
			...settings,
		});
	};

	return { toast, successToast, errorToast };
};

export default useCustomToast;
