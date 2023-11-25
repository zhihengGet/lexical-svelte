import { CODE_LANGUAGE_FRIENDLY_NAME_MAP } from '@lexical/code';
import type { ElementFormatType } from 'lexical';

const blockTypeToBlockName = {
	bullet: 'Bulleted List',
	check: 'Check List',
	code: 'Code Block',
	h1: 'Heading 1',
	h2: 'Heading 2',
	h3: 'Heading 3',
	h4: 'Heading 4',
	h5: 'Heading 5',
	h6: 'Heading 6',
	number: 'Numbered List',
	paragraph: 'Normal',
	quote: 'Quote'
};

const rootTypeToRootName = {
	root: 'Root',
	table: 'Table'
};

function getCodeLanguageOptions(): [string, string][] {
	const options: [string, string][] = [];

	for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
		options.push([lang, friendlyName]);
	}

	return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const FONT_FAMILY_OPTIONS: [string, string][] = [
	['Arial', 'Arial'],
	['Courier New', 'Courier New'],
	['Georgia', 'Georgia'],
	['Times New Roman', 'Times New Roman'],
	['Trebuchet MS', 'Trebuchet MS'],
	['Verdana', 'Verdana']
];

const FONT_SIZE_OPTIONS: [string, string][] = [
	['10px', '10px'],
	['11px', '11px'],
	['12px', '12px'],
	['13px', '13px'],
	['14px', '14px'],
	['15px', '15px'],
	['16px', '16px'],
	['17px', '17px'],
	['18px', '18px'],
	['19px', '19px'],
	['20px', '20px']
];

const ELEMENT_FORMAT_OPTIONS: {
	[key in Exclude<ElementFormatType, ''>]: {
		icon: string;
		iconRTL: string;
		name: string;
	};
} = {
	center: {
		icon: 'center-align',
		iconRTL: 'center-align',
		name: 'Center Align'
	},
	end: {
		icon: 'right-align',
		iconRTL: 'left-align',
		name: 'End Align'
	},
	justify: {
		icon: 'justify-align',
		iconRTL: 'justify-align',
		name: 'Justify Align'
	},
	left: {
		icon: 'left-align',
		iconRTL: 'left-align',
		name: 'Left Align'
	},
	right: {
		icon: 'right-align',
		iconRTL: 'left-align',
		name: 'Right Align'
	},
	start: {
		icon: 'left-align',
		iconRTL: 'right-align',
		name: 'Start Align'
	}
};

function dropDownActiveClass(active: boolean) {
	if (active) return 'active dropdown-item-active';
	else return '';
}

export {
	blockTypeToBlockName,
	rootTypeToRootName,
	getCodeLanguageOptions,
	CODE_LANGUAGE_OPTIONS,
	FONT_FAMILY_OPTIONS,
	FONT_SIZE_OPTIONS,
	ELEMENT_FORMAT_OPTIONS,
	dropDownActiveClass
};
