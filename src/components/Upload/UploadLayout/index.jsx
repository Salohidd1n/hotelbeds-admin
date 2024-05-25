import { Box } from '@chakra-ui/react';

const UploadLayout = ({ children }) => {
	return (
		<Box p={3} display={'flex'} gap={4} flexWrap={'wrap'}>
			{children}
		</Box>
	);
};

export default UploadLayout;
