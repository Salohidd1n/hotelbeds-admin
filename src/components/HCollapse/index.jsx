import { Box } from '@chakra-ui/react';

const HCollapse = ({ w, h, open = false, children, ...props }) => {
	return (
		<Box
			h={h}
			transitionDuration={'0.2s'}
			overflow="hidden"
			w={open ? w : 0}
			{...props}
		>
			{open && children}
		</Box>
	);
};

export default HCollapse;
