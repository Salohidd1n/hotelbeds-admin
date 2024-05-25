import ManyToDynamicRelationIcon from '../../assets/icons/ManyToDynamicRelationIcon';
import ManyToManyRelationIcon from '../../assets/icons/ManyToManyRelationIcon';
import OneToManyRelationIcon from '../../assets/icons/OneToManyRelationIcon';
import RecursiveRelationIcon from '../../assets/icons/RecursiveRelationIcon';

export const relationTypes = [
	{
		icon: <OneToManyRelationIcon w="18px" h="18px" />,
		label: 'Many2One',
		value: 'Many2One',
	},
	{
		icon: <ManyToManyRelationIcon w="18px" h="18px" />,
		label: 'Many2Many',
		value: 'Many2Many',
	},
	{
		icon: <RecursiveRelationIcon w="18px" h="18px" />,
		label: 'Recursive',
		value: 'Recursive',
	},
	{
		icon: <ManyToDynamicRelationIcon w="18px" h="18px" />,
		label: 'Many2Dynamic',
		value: 'Many2Dynamic',
	},
];
