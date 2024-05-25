import { Select } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

const FormNativeSelect = ({
	control,
	name,
	options = [],
	disabled,
	defaultValue = '',
	placeholder = 'Select',
	...props
}) => {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<Select
					isReadOnly={disabled}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder=""
					{...props}
				>
					<option defaultChecked={true} value={''}>
						{' '}
						{placeholder}{' '}
					</option>
					{options.map((option) => (
						<option
							defaultChecked={false}
							key={option.value}
							value={option.value}
						>
							{option.label}
						</option>
					))}
				</Select>
			)}
		/>
	);
};

export default FormNativeSelect;
