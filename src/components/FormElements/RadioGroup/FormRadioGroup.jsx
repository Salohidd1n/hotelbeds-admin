import { Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

export default function FormRadioGroup({ name, control, options = [] }) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { value, onChange } }) => {
				return (
					<RadioGroup onChange={onChange} width="100%" value={value}>
						<Stack direction="row" gap="20px">
							{options?.map((item) => (
								<Radio size="lg" key={item.value} value={item.value}>
									{item.label}
								</Radio>
							))}
						</Stack>
					</RadioGroup>
				);
			}}
		/>
	);
}
