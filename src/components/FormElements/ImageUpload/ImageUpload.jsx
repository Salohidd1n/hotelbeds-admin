import { useRef } from 'react';
import { useUploadImage } from 'services/file.service';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MdDeleteForever } from 'react-icons/md';
import styles from './index.module.scss';
import { Box, Flex, Image, Input } from '@chakra-ui/react';
import SimpleLoader from 'components/Loaders/SimpleLoader';

const ImageUpload = ({ value, onChange, required }) => {
	const ref = useRef();

	const createImage = useUploadImage({
		onSuccess: (res) => {
			onChange(res.data.imageURL);
		},
	});

	const uploadImage = (file) => {
		try {
			const newFile = new File([file], file.name, {
				type: file.type,
				lastModified: file.lastModified,
			});
			const formData = new FormData();
			formData.append('image', newFile);
			createImage.mutate(formData);
		} catch (e) {
			console.log('err-->', e);
		}
	};

	return (
		<Box>
			{!value && (
				<Flex
					alignItems="center"
					justifyContent="center"
					borderRadius={10}
					w="100px"
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
						onChange={(e) => uploadImage(e.target.files[0])}
						position="absolute"
						w="0"
						h="0"
						ref={ref}
						required={required}
						borderColor="transparent"
					/>
				</Flex>
			)}
			{value && (
				<Box borderRadius={10} overflow="hidden" className={styles.imageBox}>
					<Box className={styles.shadowLayer} />
					<button type="button" onClick={() => onChange(null)}>
						<MdDeleteForever color="#fff" size={16} />
					</button>
					<Image
						src={value}
						alt="Image Preview"
						h="100%"
						w="100%"
						objectFit="cover"
					/>
				</Box>
			)}
		</Box>
	);
};

export default ImageUpload;
