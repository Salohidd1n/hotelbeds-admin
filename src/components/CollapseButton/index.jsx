import { ChevronDownIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';

const CollapseButton = ({ onClick, isOpen = false, ...props }) => {
	return (
		<IconButton variant="link" onClick={onClick} colorScheme="gray" {...props}>
			<ChevronDownIcon
				w={'23px'}
				h={'23px'}
				transform={`rotate(${isOpen ? 180 : 0}deg)`}
				transitionDuration={'0.3s'}
			/>
		</IconButton>
	);
};

export default CollapseButton;
