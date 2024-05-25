import { Box, Flex, Text } from '@chakra-ui/react';
import PdfIcon from '../../../assets/icons/pdfIcon';
import { MdFileDownload } from 'react-icons/md';
import { AiFillEye } from 'react-icons/ai';

const UploadCard = () => {
	return (
		<Box
			display={'flex'}
			justifyContent="space-between"
			width={'330px'}
			height={'66px'}
			px={4}
			borderRadius={'12px'}
			bg={'rgba(222, 132, 78, 0.06)'}
		>
			<Flex height={'100%'} align="center" gap={'4'}>
				<PdfIcon boxSize={34} />
				<Flex flexDir={'column'} gap="1">
					<Text lineHeight={'17px'} fontWeight="500" fontSize={'14px'}>
            Ogohlantirish 08/22 pdf
					</Text>
					<Text
						fontSize={'12px'}
						lineHeight="16px"
						fontWeight={'400'}
						color="#84919A"
					>
            1.6 MB
					</Text>
				</Flex>
			</Flex>
			<Flex height={'100%'} align="center" gap="3">
				<AiFillEye color="#00CD69" size="25" />
				<MdFileDownload color="#DE844E" size="25" />
			</Flex>
		</Box>
	);
};

export default UploadCard;
