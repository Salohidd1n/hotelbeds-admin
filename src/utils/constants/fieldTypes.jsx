import {
	AiFillFile,
	AiFillLock,
	AiFillPhone,
	AiOutlineBarcode,
	AiOutlineLine,
	AiTwotoneMail,
} from 'react-icons/ai';
import { BiTimeFive } from 'react-icons/bi';
import {
	BsFillCalendarFill,
	BsFillCameraVideoFill,
	BsImageFill,
	BsSortAlphaUpAlt,
	BsSortNumericUpAlt,
	BsTelephoneFill,
	BsToggleOn,
} from 'react-icons/bs';
import { FaBusinessTime, FaGripLines, FaHashtag, FaList } from 'react-icons/fa';
import { ImCheckboxChecked } from 'react-icons/im';
import { TbIcons, TbMathSymbols, TbSquareRoot2 } from 'react-icons/tb';

export const fieldTypes = [
	{
		label: 'Text',
		options: [
			{
				icon: <AiOutlineLine />,
				label: 'Single line',
				value: 'SINGLE_LINE',
			},
			{
				icon: <FaGripLines />,
				label: 'Multi line',
				value: 'MULTI_LINE',
			},
		],
	},
	{
		label: 'Date',
		options: [
			{
				icon: <BsFillCalendarFill />,
				label: 'Date',
				value: 'DATE',
			},
			{
				icon: <BiTimeFive />,
				label: 'Time',
				value: 'TIME',
			},
			{
				icon: <FaBusinessTime />,
				label: 'Date time',
				value: 'DATE_TIME',
			},
		],
	},
	{
		label: 'Number',
		options: [
			{
				icon: <FaHashtag />,
				label: 'Number',
				value: 'NUMBER',
			},
		],
	},
	{
		label: 'Input',
		options: [
			{
				icon: <ImCheckboxChecked />,
				label: 'Checkbox',
				value: 'CHECKBOX',
			},
			{
				icon: <BsToggleOn />,
				label: 'Switch',
				value: 'SWITCH',
			},
		],
	},
	{
		label: 'Select',
		options: [
			// {
			//   label: "Picklist",
			//   value: "PICK_LIST"
			// },
			{
				icon: <FaList />,
				label: 'Multi select',
				value: 'MULTISELECT',
			},
		],
	},
	{
		label: 'File',
		options: [
			{
				icon: <BsImageFill />,
				label: 'Photo',
				value: 'PHOTO',
			},
			{
				icon: <BsFillCameraVideoFill />,
				label: 'Video',
				value: 'VIDEO',
			},
			{
				icon: <AiFillFile />,
				label: 'File',
				value: 'FILE',
			},
		],
	},
	{
		label: 'Formula',
		options: [
			{
				icon: <TbSquareRoot2 />,
				label: 'Formula in frontend',
				value: 'FORMULA_FRONTEND',
			},
			{
				icon: <TbMathSymbols />,
				label: 'Formula in backend',
				value: 'FORMULA',
			},
		],
	},
	{
		label: 'Other',
		options: [
			{
				icon: <BsSortNumericUpAlt />,
				label: 'Increment ID',
				value: 'INCREMENT_ID',
			},
			{
				icon: <BsSortAlphaUpAlt />,
				label: 'Increment number',
				value: 'INCREMENT_NUMBER',
			},
			{
				icon: <BsTelephoneFill />,
				label: 'Phone',
				value: 'PHONE',
			},
			{
				icon: <AiTwotoneMail />,
				label: 'Email',
				value: 'EMAIL',
			},
			{
				icon: <TbIcons />,
				label: 'Icon',
				value: 'ICON',
			},
			{
				icon: <AiFillLock />,
				label: 'Password',
				value: 'PASSWORD',
			},
			{
				icon: <AiOutlineBarcode />,
				label: 'Barcode',
				value: 'BARCODE',
			},
			// {
			//   icon: <IoMdColorFill />,
			//   label: 'Autofill',
			//   value: 'AUTOFILL'
			// }
		],
	},
];
