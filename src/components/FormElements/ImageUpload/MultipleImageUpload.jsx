import { useRef } from 'react';
import { useUploadImage } from 'services/file.service';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MdDeleteForever } from 'react-icons/md';
import styles from './index.module.scss';
import { Box, Flex, Image, Input } from '@chakra-ui/react';
import SimpleLoader from 'components/Loaders/SimpleLoader';

const MultipleImageUpload = ({ value, onChange, required }) => {
	const ref = useRef();

	const createImage = useUploadImage({
		onSuccess: (res) => {
			onChange(value ? [...value, res.data.imageURL] : [res.data.imageURL]);
		},
	});

	const uploadImage = (files) => {
		try {
			Object.values(files).forEach((file) => {
				const newFile = new File([file], file.name, {
					type: file.type,
					lastModified: file.lastModified,
				});
				const formData = new FormData();
				formData.append('image', newFile);
				createImage.mutate(formData);
			});
		} catch (e) {
			console.log('err-->', e);
		}
	};

	const onRemoveImage = (val) => {
		onChange(value.filter((image) => image !== val));
	};

	return (
		<Flex gap={4}>
			<Flex
				alignItems="center"
				justifyContent="center"
				borderRadius={10}
				minW="100px"
				h="100px"
				border="1px solid"
				cursor="pointer"
				onClick={() => ref.current.click()}
				position="relative"
			>
				{createImage.isLoading ? (
					<SimpleLoader />
				) : (
					<IoCloudUploadOutline size={30} />
				)}
				<Input
					type="file"
					accept="image/*"
					onChange={(e) => uploadImage(e.target.files)}
					position="absolute"
					w="0"
					h="0"
					ref={ref}
					required={value?.length > 0 ? false : required}
					borderColor="transparent"
				/>
			</Flex>

			{value?.length > 0 && (
				<Flex gap={4} flexWrap="wrap">
					{value.map((image) => (
						<Box
							key={image}
							borderRadius={10}
							overflow="hidden"
							className={styles.imageBox}
						>
							<Box className={styles.shadowLayer} />
							<button type="button" onClick={() => onRemoveImage(image)}>
								<MdDeleteForever color="#fff" size={16} />
							</button>
							<Image
								src={image}
								alt="Image Preview"
								h="100%"
								w="100%"
								objectFit="cover"
							/>
						</Box>
					))}
				</Flex>
			)}
		</Flex>
	);
};

export default MultipleImageUpload;
