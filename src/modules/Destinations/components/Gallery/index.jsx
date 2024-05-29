import { Grid, Image } from '@chakra-ui/react';

export function Gallery({ images, size }) {
	return (
		<Grid templateColumns="repeat(6, 1fr)" gap={3}>
			{images?.map((image, idx) => (
				<Image key={idx} h="100px" w="100%" objectFit="cover" src={image} />
			))}
		</Grid>
	);
}
