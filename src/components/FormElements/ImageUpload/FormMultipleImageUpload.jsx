import { FormErrorMessage } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import MultipleImageUpload from './MultipleImageUpload';

const FormMultipleImageUpload = ({
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
					<MultipleImageUpload
						onChange={onChange}
						value={value}
						required={required}
					/>
					<FormErrorMessage>{error?.message}</FormErrorMessage>
				</>
			)}
		/>
	);
};

export default FormMultipleImageUpload;
