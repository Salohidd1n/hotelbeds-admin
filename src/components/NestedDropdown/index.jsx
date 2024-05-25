import { Dropdown } from 'react-nested-dropdown';
import './index.scss';

const NestedDropdown = ({ items, children, ...props }) => {
	return (
		<Dropdown items={items} containerWidth="100%" {...props}>
			{children}
		</Dropdown>
	);
};
export default NestedDropdown;
