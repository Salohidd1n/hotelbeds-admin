import { Box } from '@chakra-ui/react';
import { Select, components } from 'chakra-react-select';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import formatGroupLabel from './formatGroupLabel';

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

const FormSelectWithIcons = ({
	control,
	name,
	options = [],
	withGroup = false,
	disabled,
	defaultValue = '',
	...props
}) => {
	const computedOptions = useMemo(() => {
		if (!withGroup) return options;

		const arr = [];
		options.forEach((option) =>
			option.options?.forEach((opt) => arr.push(opt))
		);

		return arr;
	}, [options, withGroup]);

	console.log('computedOptions ==>', computedOptions);

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<Select
					options={options}
					isReadOnly={disabled}
					// components={{ Option: IconOption, SingleValue: CustomSelectValue }}
					value={computedOptions.find((option) => option.value === value)}
					onChange={(val) => onChange(val.value)}
					menuPortalTarget={document.body}
					styles={{
						menuPortal: (provided) => ({ ...provided, zIndex: 2 }),
					}}
					components={{ Option: IconOption, SingleValue: CustomSelectValue }}
					formatGroupLabel={formatGroupLabel}
					{...props}
				/>
			)}
		/>
	);
};

export default FormSelectWithIcons;
