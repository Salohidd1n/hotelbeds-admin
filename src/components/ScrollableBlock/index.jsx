import { Box } from '@chakra-ui/react';

const ScrollableBlock = ({ children, ...props }) => {
	return (
		<Box
			position={'absolute'}
			top={0}
			left={0}
			right={0}
			bottom={0}
			overflowY="auto"
			{...props}
		>
			{children}
		</Box>
	);
};

export default ScrollableBlock;
