import InputFilter from './InputFilter';

const Filters = ({ filterType, placeholder }) => {
	switch (filterType) {
	case 'INPUT':
		return <InputFilter placeholder={placeholder} />;

	default:
		return null;
	}
};
export default Filters;
