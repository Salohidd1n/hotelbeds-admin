import { Box } from '@chakra-ui/react';
import styles from './index.module.scss';

export const Footer = ({ children, ...props }) => {
	return (
		<Box className={styles.footer} {...props}>
			{children}
		</Box>
	);
};

export const FooterLeftSide = ({ children, ...props }) => {
	return (
		<Box className={styles.footerLeftSide} {...props}>
			{children}
		</Box>
	);
};

export const FooterExtraSide = ({ children, ...props }) => {
	return (
		<Box className={styles.footerExtraSide} {...props}>
			{children}
		</Box>
	);
};

export default Footer;
