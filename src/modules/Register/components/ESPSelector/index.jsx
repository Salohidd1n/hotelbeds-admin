import { Box, HStack, Text } from '@chakra-ui/react';
import EspError from 'assets/icons/espError';
import clsx from 'clsx';
import SimpleLoader from 'components/Loaders/SimpleLoader';
import { format } from 'date-fns';
import { useESPKeys } from 'hooks/useESP';
import { useState } from 'react';
import styles from './index.module.scss';

const ESPSelector = ({ selectedKey, setSelectedKey }) => {
	const { isLoading, keys, error } = useESPKeys();

	console.log('SELECTED KEY -->', selectedKey);

	const clickHandler = (key) => {
		if (!key.isValid) return;
		setSelectedKey(key);
	};

	if (isLoading)
		return (
			<Box className={styles.container}>
				<SimpleLoader h="full" />
			</Box>
		);

	if (error)
		return (
			<Box className={styles.container}>
				<Box className={styles.errorBlock}>
					<EspError w={24} h={24} />
					<Text className={styles.errorMessage}>{error.message}</Text>
				</Box>
			</Box>
		);

	return (
		<Box className={styles.container}>
			{keys.map((key) => (
				<Box
					onClick={() => clickHandler(key)}
					key={key.key}
					className={clsx(styles.keyBlock, {
						[styles.active]: selectedKey?.key === key.key,
						[styles.invalid]: !key.isValid,
					})}
				>
					<Text className={styles.branch}>{key.CN}</Text>
					<Text className={styles.user}>{key.region}</Text>
					<HStack spacing={4}>
						<Text className={styles.organization}>
              Ташкилот СТИРи: <b>{key.TIN}</b>
						</Text>
						<Text className={styles.organization}>
              ПИНФЛ: <b>{key.PINFL}</b>
						</Text>
					</HStack>
					<Box className={styles.expired}>
            ЭРИ амал килиш муддати:{' '}
						<b>{format(new Date(key.validTo), 'dd.MM.yyyy')}</b>
					</Box>
				</Box>
			))}
		</Box>
	);
};

export default ESPSelector;
