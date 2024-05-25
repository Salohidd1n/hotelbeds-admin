import {
	FormErrorMessage,
	Input,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

const FormInput = ({
	control,
	required = false,
	name,
	inputProps = {},
	disabled = false,
	inputLeftElement,
	inputRightElement,
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
					<InputGroup {...props}>
						{inputLeftElement}

						<Input
							value={value}
							onChange={onChange}
							isInvalid={Boolean(error)}
							readOnly={disabled}
							placeholder={placeholder}
							autoFocus={autoFocus}
							{...inputProps}
							required={false}
						/>
						<InputRightElement width="2.5rem">
							{inputRightElement}
						</InputRightElement>
					</InputGroup>

					<FormErrorMessage>{error?.message}</FormErrorMessage>
				</>
			)}
		/>
	);
};

export default FormInput;
