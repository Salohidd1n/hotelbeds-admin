import { useState } from 'react';

const useBooleanState = (defaultValue = false) => {
	const [state, setState] = useState(defaultValue);

	const setToTrue = () => {
		setState(true);
	};

	const setToFalse = () => {
		setState(false);
	};

	return [state, setToTrue, setToFalse, setState];
};

export default useBooleanState;
