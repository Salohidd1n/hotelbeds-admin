import { Box, Icon, Text, Tooltip } from '@chakra-ui/react';
import styles from './index.module.scss';

import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiFillLeftCircle } from 'react-icons/ai';
import Logo from '../../assets/logos/logo.svg';

const Sidebar = ({ elements }) => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const onRowClick = (element) => {
		navigate(element.link);
	};

	return (
		<Box className={styles.sidebar}>
			<Box className={styles.header}>
				<img src={Logo} alt="logo" width={170} />
				{/* <Logo /> */}
				{/* <Icon
          as={AiFillLeftCircle}
          boxSize="24px"
          color="primary.main"
          cursor="pointer"
          _hover={{ color: "primary.500" }}
        /> */}
			</Box>

			<Box className={styles.body}>
				{elements?.map((element, index) => (
					<Box key={index}>
						<Box
							className={clsx(styles.row, {
								[styles.active]: pathname.startsWith(element.link),
							})}
							onClick={() => onRowClick(element)}
						>
							<Tooltip label={element.label}>
								<Box className={styles.element}>
									<Icon as={element.icon} className={styles.icon} />

									<Text className={styles.label}>{element.label}</Text>
								</Box>
							</Tooltip>
						</Box>

						{pathname.includes(element.link) && (
							<Box pl="15px">
								{element?.children?.map((value) => (
									<Box
										key={value.link}
										className={clsx(styles.row, {
											[styles.active]: pathname.startsWith(value.link),
										})}
										onClick={() => onRowClick(value)}
									>
										<Tooltip label={value.label}>
											<Box className={styles.element}>
												<Icon as={value.icon} className={styles.icon} />

												<Text className={styles.label}>{value.label}</Text>
											</Box>
										</Tooltip>
									</Box>
								))}
							</Box>
						)}
					</Box>
				))}
			</Box>
		</Box>
	);
};
export default Sidebar;
