import { Box, Flex, Heading, Text } from '@chakra-ui/react';

export default function Cards({ title = '', count = 0, icon = '' }) {
	return (
		<Box
			// width={"278px"}
			height={'107px'}
			background={'white'}
			borderRadius={'16px'}
			display={'flex'}
			flexDirection={'column'}
			justifyContent={'center'}
			p={4}
		>
			<Flex justifyContent={'space-between'} align={'center'}>
				<Box height={'100%'}>
					<Heading
						fontWeight={'400'}
						lineHeight="19px"
						fontSize={'16px'}
						color={'#8A92A6'}
					>
						{title}
					</Heading>
					<Text fontWeight={'500'} fontSize={'33px'} lineHeight={'40px'}>
						{count}
					</Text>
				</Box>
				<Box>{icon}</Box>
			</Flex>
		</Box>
	);
}
