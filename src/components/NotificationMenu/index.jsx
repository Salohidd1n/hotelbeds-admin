import { Icon, IconButton } from '@chakra-ui/react';
import { MdOutlineNotifications } from 'react-icons/md';

const NotificationMenu = ({ ...props }) => {
	return (
		<IconButton colorScheme="gray" variant="outline">
			<Icon as={MdOutlineNotifications} {...props} boxSize={18} />
		</IconButton>
	);
};
export default NotificationMenu;
