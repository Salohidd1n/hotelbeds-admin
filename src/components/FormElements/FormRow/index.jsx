import { Box, FormControl, FormLabel } from '@chakra-ui/react';

const FormRow = ({
	label = '',
	color,
	required = false,
	children,
	boxProps = {},
	...props
}) => {
	return (
		<FormControl {...props} isRequired={required}>
			<FormLabel fontWeight={500} color={color}>
				{label}
			</FormLabel>

			<Box px={'1px'} {...boxProps}>
				{children}
			</Box>

			{/* <FormHelperText>We'll never share your email.</FormHelperText> */}
		</FormControl>
	);
};

export default FormRow;
