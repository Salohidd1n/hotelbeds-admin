import { useToast } from '@chakra-ui/react';

const useCustomToast = () => {
	const chakraToast = useToast();

	const toast = (settings = {}) => {
		chakraToast({
			title: 'Успешно',
			description: 'Авторизация прошла успешно',
			position: 'top-right',
			status: 'success',
			duration: 3000,
			isClosable: true,
			...settings,
		});
	};

	const successToast = (description = '', settings = {}) => {
		chakraToast({
			title: 'Успешно',
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
			title: 'Ошибка',
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
