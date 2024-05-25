import { Box, FormControl, FormLabel } from '@chakra-ui/react';

const HFormRow = ({
	label = '',
	color,
	required = false,
	children,
	boxProps = {},
	...props
}) => {
	return (
		<FormControl
			display="flex"
			alignItems="center"
			{...props}
			isRequired={required}
		>
			<FormLabel fontWeight={500} w={200} color={color}>
				{label}
			</FormLabel>

			<Box px={'1px'} flex={1} {...boxProps}>
				{children}
			</Box>

			{/* <FormHelperText>We'll never share your email.</FormHelperText> */}
		</FormControl>
	);
};

export default HFormRow;
