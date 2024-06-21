// src/components/TagsInput.js

import { CloseIcon } from '@chakra-ui/icons';
import { Badge, Box, Input, Text } from '@chakra-ui/react';

function TagsInput({ tags, removeTag, addTag }) {
	function handleKeyDown(e) {
		if (e.key !== 'Enter') {
			return;
		}

		e.preventDefault();
		const value = e.target.value;
		if (!value.trim()) return;

		addTag(value);
		e.target.value = '';
	}

	return (
		<Box
			display="flex"
			flexWrap="wrap"
			gap={2}
			border="1px solid #c1c1c1"
			borderRadius="6px"
			p={2}
		>
			{tags.map((tag, index) => (
				<Badge
					p={2}
					gap={2}
					key={index}
					display="flex"
					alignItems="center"
					borderRadius="5px"
					justifyContent="center"
				>
					<Text className="text" fontSize="12px">
						{tag}
					</Text>
					<button
						type="button"
						className="close"
						onClick={() => removeTag(index)}
					>
						<CloseIcon />
					</button>
				</Badge>
			))}
			<Input
				flex={1}
				onKeyDown={handleKeyDown}
				type="text"
				className="tags-input"
				placeholder="Type synonym"
				// maxWidth={200}
				minWidth={150}
				border="none"
			/>
		</Box>
	);
}

export default TagsInput;
