import type { Converter } from '$utils/converter';
import type { DictionaryRow, TemplateType } from '$utils/dict';
import { writable } from 'svelte/store';

type ConverterStoreState = {
	isLoading: boolean;
	converter: Converter | null;
	templateType: TemplateType;
	startRow: number;
	mapping: DictionaryRow | null;
};

export function createStore() {
	const { subscribe, set, update } = writable<ConverterStoreState>({
		isLoading: false,
		converter: null,
		templateType: 'Retail PRO',
		mapping: null,
		startRow: 2
	});

	const setLoading = (value: boolean) => {
		update((v) => ({
			...v,
			isLoading: value
		}));
	};

	const setConverter = async (converter: Converter | null) => {
		update((v) => ({
			...v,
			converter
		}));
	};

	const clearConverter = () => {
		update((v) => ({
			...v,
			converter: null
		}));
	};

	const updateTemplateType = (templateType: TemplateType) => {
		update((v) => ({
			...v,
			templateType: templateType
		}));
	};

	const updateStartRow = (num: number) => {
		update((value) => ({
			...value,
			startRow: num
		}));
	};

	return {
		subscribe,
		set,
		setLoading,
		setConverter,
		clearConverter,
		updateTemplateType,
		updateStartRow
	};
}

export const converter = createStore();
