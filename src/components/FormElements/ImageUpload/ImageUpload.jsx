import { Box, Flex, FormErrorMessage, Image, Input } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { useRef, useState } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { MdDeleteForever } from 'react-icons/md';
import styles from './index.module.scss';

const ImageUpload = ({
	control,
	required = false,
	name,
	inputProps = {},
	disabled = false,
	inputLeftElement,
	inputRightElement,
	defaultValue = '',
	...props
}) => {
	const ref = useRef();

	return (
		<Box>
			<Controller
				name={name}
				control={control}
				defaultValue={defaultValue}
				rules={{ required }}
				render={({ field: { onChange, value }, fieldState: { error } }) => (
					<>
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
								<Input
									{...props}
									type="file"
									accept="image/*"
									onChange={(e) => onChange(e.target.files[0])}
									position="absolute"
									w="0"
									h="0"
									ref={ref}
									required={required}
									borderColor="transparent"
								/>
								<IoCloudUploadOutline size={30} />
							</Flex>
						)}
						{value && (
							<Box
								borderRadius={10}
								overflow="hidden"
								className={styles.imageBox}
							>
								<Box className={styles.shadowLayer} />
								<button type="button" onClick={() => onChange(null)}>
									<MdDeleteForever color="#fff" size={16} />
								</button>
								<Image
									src={
										typeof value === 'string'
											? value
											: URL.createObjectURL(value)
									}
									alt="Image Preview"
									h="100%"
									w="100%"
									objectFit="cover"
								/>
							</Box>
						)}
						<FormErrorMessage>{error?.message}</FormErrorMessage>
					</>
				)}
			/>
		</Box>
	);
};

export default ImageUpload;
