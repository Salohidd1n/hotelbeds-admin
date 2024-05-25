import {
	Avatar,
	AvatarBadge,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from '@chakra-ui/react';
import { BiLogOut } from 'react-icons/bi';
import authStore from '../../store/auth.store';

const ProfileMenu = () => {
	return (
		<Menu>
			<MenuButton
				as={Avatar}
				name="ooo pp"
				bg="#BDBDBD"
				cursor="pointer"
				pl={2.5}
			>
				<AvatarBadge bg="primary.main" boxSize="1.25em" />
			</MenuButton>

			<MenuList>
				<MenuItem alignItems="center" onClick={() => authStore.logout()}>
					<Icon as={BiLogOut} boxSize={5} mr={2} />
          Logout
				</MenuItem>
			</MenuList>
		</Menu>
	);

	// return <Avatar></Avatar>;
};
export default ProfileMenu;
