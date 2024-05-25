import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
	FormErrorMessage,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const FormPasswordInput = ({
	control,
	required = false,
	name,
	inputProps = {},
	inputLeftElement,
	...props
}) => {
	const [show, setShow] = useState(false);
	const handleClick = () => setShow(!show);

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

						<Input
							value={value}
							onChange={onChange}
							isInvalid={error}
							type={show ? 'text' : 'password'}
							{...inputProps}
						/>

						<InputRightElement>
							<IconButton
								onClick={handleClick}
								variant={'ghost'}
								icon={
									show ? <ViewOffIcon w={5} h={5} /> : <ViewIcon w={5} h={5} />
								}
							/>
						</InputRightElement>
					</InputGroup>

					<FormErrorMessage>{error?.message}</FormErrorMessage>
				</>
			)}
		/>
	);
};

export default FormPasswordInput;
