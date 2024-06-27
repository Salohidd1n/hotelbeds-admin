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
import { useLogoutMutation } from 'services/auth.service';

const ProfileMenu = () => {
	const { mutate, isLoading } = useLogoutMutation();

	const logout = () => {
		const refreshToken = authStore.token?.refresh;

		mutate(
			{
				refreshToken,
			},
			{
				onSuccess: () => {
					authStore.logout();
				},
				onSettled: () => {
					authStore.logout();
				},
			},
		);
	};

	return (
		<Menu>
			<MenuButton
				as={Avatar}
				name={[
					authStore.userData?.user_first_name,
					authStore.userData?.user_last_name,
				].join(' ')}
				bg="#BDBDBD"
				cursor="pointer"
				pl={2.5}
			>
				<AvatarBadge bg="primary.main" boxSize="1.25em" />
			</MenuButton>

			<MenuList>
				<MenuItem alignItems="center" onClick={logout} disabled={isLoading}>
					<Icon as={BiLogOut} boxSize={5} mr={2} />
					{isLoading ? 'Logging out...' : 'Logout'}
				</MenuItem>
			</MenuList>
		</Menu>
	);

	// return <Avatar></Avatar>;
};
export default ProfileMenu;
