import { Box, Center } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import styles from './index.module.scss';
import logo from '../../assets/logos/logo.svg';

const AuthLayout = () => {
	return (
		<Box className={styles.layout}>
			<Center className={styles.logoSide}>
				<img src={logo} />
			</Center>

			<Box className={styles.formSide}>
				<Outlet />
			</Box>
		</Box>
	);
};

export default AuthLayout;
