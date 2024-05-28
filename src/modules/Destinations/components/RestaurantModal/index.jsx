import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import styles from './index.module.scss';

export function RestaurantModal({
	isOpen,
	onClose,
	title,
	rating,
	reviewsCount,
	address,
	images,
	rateFood,
	rateService,
	rateValue,
	overallRate,
	openTime,
	phone,
	cuisines,
	locationId,
}) {
	return (
		<Modal onClose={onClose} isOpen={isOpen}>
			<ModalOverlay />
			<ModalContent minW="700px">
				<ModalCloseButton />
				<ModalBody px="20px" py="30px">
					<h2 className={styles.title}>{title}</h2>
					<Flex></Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
}
