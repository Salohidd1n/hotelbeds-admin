import { DragHandleIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	HStack,
	IconButton,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
} from '@chakra-ui/react';
import styles from './index.module.scss';
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag } from 'utils/applyDrag';
import useTableColumns from 'hooks/useTableColumns';
import { useFieldArray, useForm } from 'react-hook-form';
import FormCheckbox from 'components/FormElements/Checkbox/FormCheckbox';

const ColumnsModal = ({ closeModal, tableSlug }) => {
	const { computedColumns, setColumns } = useTableColumns(tableSlug);

	const { control, handleSubmit } = useForm({
		defaultValues: {
			columns: computedColumns ?? [],
		},
	});

	const { fields: columns, move } = useFieldArray({
		control: control,
		name: 'columns',
	});

	const onDrop = (dropResult) => {
		const result = applyDrag(columns, dropResult);
		if (result) {
			console.log('sssss');
			move(dropResult.removedIndex, dropResult.addedIndex);
		}
	};

	const onSubmit = ({ columns }) => {
		setColumns(columns);
		closeModal();
	};

	return (
		<>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Table columns</ModalHeader>
				<ModalCloseButton onClick={closeModal} />
				<ModalBody pt={0}>
					<Box className={styles.container}>
						<Container
							onDrop={onDrop}
							dropPlaceholder={{
								animationDuration: 150,
								showOnTop: true,
								className: 'drop-preview',
							}}
							dragClass={styles.ghost}
							dragHandleSelector=".drag-handler"
						>
							{columns?.map((column, index) => (
								<Draggable key={column.title}>
									<HStack key={column.title} className={styles.row}>
										<HStack className={styles.titleBlock}>
											<IconButton
												variant="ghost"
												className="drag-handler"
												cursor="grab"
											>
												<DragHandleIcon />
											</IconButton>
											<Text>{column.title}</Text>
										</HStack>
										<FormCheckbox
											size="lg"
											control={control}
											name={`columns.${index}.isVisible`}
										/>
									</HStack>
								</Draggable>
							))}
						</Container>
					</Box>
				</ModalBody>

				<ModalFooter gap={2}>
					<Button variant="outline" colorScheme="red" onClick={closeModal}>
            Отменить
					</Button>
					<Button onClick={handleSubmit(onSubmit)}>Сохранить</Button>
				</ModalFooter>
			</ModalContent>
		</>
	);
};
export default ColumnsModal;
