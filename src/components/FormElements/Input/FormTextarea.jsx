import { FormErrorMessage, Textarea } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

const FormTextarea = ({
	control,
	required = false,
	name,
	inputProps = {},
	disabled = false,
	defaultValue = '',
	placeholder = '',
	autoFocus = false,
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
					<Textarea
						value={value}
						onChange={onChange}
						isInvalid={Boolean(error)}
						readOnly={disabled}
						placeholder={placeholder}
						autoFocus={autoFocus}
						{...props}
						required={false}
					/>
					<FormErrorMessage>{error?.message}</FormErrorMessage>
				</>
			)}
		/>
	);
};

export default FormTextarea;
