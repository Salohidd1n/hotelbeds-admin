import { Box } from '@chakra-ui/react';
import { Select, components } from 'chakra-react-select';
import { useMemo } from 'react';

const { Option } = components;
const IconOption = (props) => (
	<Option {...props}>
		<Box display="flex" alignItems="center" gap={2}>
			{props.data.icon}
			{props.data.label}
		</Box>
	</Option>
);

const CustomSelectValue = (props) => (
	<Box display="flex" alignItems="center" gap={2}>
		{props.data.icon}
		{props.data.label}
	</Box>
);

const SelectWithIcons = ({ options = [], value, onChange, ...props }) => {
	const computedValue = useMemo(() => {
		return options.find((option) => option.value === value);
	}, [value, options]);

	return (
		<Select
			name="color"
			options={options}
			placeholder="Select"
			components={{ Option: IconOption, SingleValue: CustomSelectValue }}
			value={computedValue}
			onChange={(val) => onChange(val.value)}
			{...props}
		/>
	);
};

export default SelectWithIcons;
