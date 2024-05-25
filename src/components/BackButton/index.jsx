import { Icon, IconButton } from '@chakra-ui/react';
import { ImArrowLeft2 } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ className = '', link = -1, ...props }) => {
	const navigate = useNavigate();

	return (
		<IconButton variant="ghost" colorScheme="primary" {...props}>
			<Icon
				as={ImArrowLeft2}
				w={'20px'}
				h={'20px'}
				onClick={() => navigate(link)}
			/>
		</IconButton>
	);
};

export default BackButton;
