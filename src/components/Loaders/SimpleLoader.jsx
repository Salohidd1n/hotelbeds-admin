import { Center, Spinner } from '@chakra-ui/react';

const SimpleLoader = ({ ...props }) => {
	return (
		<Center {...props}>
			<Spinner color="primary.main" size="lg" />
		</Center>
	);
};

export default SimpleLoader;
