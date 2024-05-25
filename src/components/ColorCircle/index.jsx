import { Box } from '@chakra-ui/react';
import styles from './index.module.scss';

const ColorCircle = ({ color, ...props }) => {
	return (
		<Box
			className={styles.circle}
			bgColor={color ?? '#fff'}
			borderColor={color}
			{...props}
		/>
	);
};

export default ColorCircle;
