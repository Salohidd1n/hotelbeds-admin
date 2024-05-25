import { Checkbox, Switch } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

const FormSwitch = ({
	control,
	required = false,
	name,
	inputProps = {},
	disabled = false,
	inputLeftElement,
	defaultValue = false,
	children,
	...props
}) => {
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			rules={{ required }}
			render={({ field: { onChange, value }, fieldState: { error } }) => (
				<Switch
					isInvalid={error}
					onChange={onChange}
					isChecked={value}
					{...props}
				>
					{children}
				</Switch>
			)}
		/>
	);
};

export default FormSwitch;
