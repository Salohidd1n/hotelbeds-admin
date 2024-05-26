import { FormErrorMessage } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import ImageUpload from './ImageUpload';

const FromImageUpload = ({
	control,
	required = false,
	name,
	inputProps = {},
	disabled = false,
	inputLeftElement,
	inputRightElement,
	defaultValue = '',
	...props
}) => {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			rules={{ required }}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<>
					<ImageUpload onChange={onChange} value={value} required={required} />
					<FormErrorMessage>{error?.message}</FormErrorMessage>
				</>
			)}
		/>
	);
};

export default FromImageUpload;
