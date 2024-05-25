import styles from './index.module.scss';
import { Box } from '@chakra-ui/react';

export const Page = ({ children, ...props }) => {
	return (
		<Box className={styles.page} {...props}>
			{children}
		</Box>
	);
};
