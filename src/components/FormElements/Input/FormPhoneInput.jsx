import { FormErrorMessage, Input, InputGroup } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import ReactInputMask from 'react-input-mask';

const FormPhoneInput = ({
	control,
	required = false,
	name,
	inputProps = {},
	inputLeftElement,
	...props
}) => {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue=""
			rules={{ required }}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<>
					<InputGroup {...props}>
						{inputLeftElement}

						<ReactInputMask
							mask="(99) 999-99-99"
							value={value}
							onChange={onChange}
						>
							{(maskProps) => (
								<Input
									value={value}
									onChange={onChange}
									isInvalid={error}
									{...maskProps}
									{...inputProps}
								/>
							)}
						</ReactInputMask>
					</InputGroup>

					<FormErrorMessage>{error?.message}</FormErrorMessage>
				</>
			)}
		/>
	);
};

export default FormPhoneInput;
