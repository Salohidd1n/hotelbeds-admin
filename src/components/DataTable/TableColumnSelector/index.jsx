import { Icon, IconButton, Modal } from '@chakra-ui/react';
import useBooleanState from 'hooks/useBooleanState';
import { MdTableChart } from 'react-icons/md';
import ColumnsModal from './Modal';

const TableColumnSelector = ({ tableSlug }) => {
	const [modalIsOpen, openModal, closeModal] = useBooleanState();

	return (
		<>
			<IconButton variant="outline" onClick={openModal}>
				<Icon as={MdTableChart} boxSize={6} />
			</IconButton>
			<Modal
				isOpen={modalIsOpen}
				onClose={closeModal}
				scrollBehavior="inside"
				size="2xl"
			>
				<ColumnsModal closeModal={closeModal} tableSlug={tableSlug} />
			</Modal>
		</>
	);
};
export default TableColumnSelector;
